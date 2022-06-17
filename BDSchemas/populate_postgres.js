import pg from 'pg'
import fs from 'fs'
import { exit } from 'process';

const Tables = {
  jogador: {name: 'jogador', numOfFields: 8},
  time: {name: 'time', numOfFields: 3},
  jogo: {name: 'jogo', numOfFields: 6},
  usuario: {name: 'usuario', numOfFields: 6},
  apostas: {name: 'apostas', numOfFields: 6},
  deposito: {name: 'deposito', numOfFields: 3},
}

export async function connect() {
    if (global.connection)
      return global.connection.connect();
 
    const { Pool } = pg;
    const pool = new Pool({
      connectionString: 'postgres://postgres:admin@localhost:5432/ep4'
    });
 
    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");
 
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();
 
    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

async function insertRow(db, table, values, numOfValues) {
  if (!values || !values.length) {
    console.log("Não recebi um array")
    return;
  }
  if (values.length !== numOfValues) {
    console.log(`Numero errado de valores: Recebi ${values.length} Esperava ${numOfValues}`);
    return;
  }

  let valueIndexes = '';
  for (let i = 1; i <= values.length; i++) {
    valueIndexes += i === 1 ? `$${i}` : `,$${i}`;
  }
  try {
    await db.query(`INSERT INTO ${table} VALUES (${valueIndexes})`, values);
  } catch (e) {
    if (e.code === '23505') {
      console.log('Este Id já existe');
      return Promise.resolve()
    }
  }
}

async function populate_postgres(allTeams, allPlayers, allFixtures, allUsers, allBets) {
  const db = await connect();
  
  const allPromises = [];
  allTeams.forEach(
    team => 
      allPromises.push(
        insertRow(db, Tables.time.name, team, Tables.time.numOfFields)
      )
  );
  allPlayers.forEach(
    player => 
      allPromises.push(
        insertRow(db, Tables.jogador.name, player, Tables.jogador.numOfFields)
      )
  );
  allFixtures.forEach(
    fixture => 
      allPromises.push(
        insertRow(db, Tables.jogo.name, fixture, Tables.jogo.numOfFields)
      )
  );
  allUsers.forEach(
    user => 
      allPromises.push(
        insertRow(db, Tables.usuario.name, user, Tables.usuario.numOfFields)
      )
  );
  allBets.forEach(
    bet => 
      allPromises.push(
        insertRow(db, Tables.apostas.name, bet, Tables.apostas.numOfFields)
      )
  );

  await Promise.all(allPromises);
  db.end();
  exit(0);
}

function parseJogadorData(allTeams) {
  const jogadorData = fs.readFileSync('./processedData/playersId.json');
  const allData = JSON.parse(jogadorData);
  const allPlayers = [];
  
  for (let i = 0; i < allData.length; i++) {
    const id = allData[i].id;
    const {name, birth, height, weight} = allData[i].info;
    const { team: playerTeam } = allData[i].statistics[0]
    const desiredValues = [
      id, 
      name, 
      birth.date, 
      birth.place, 
      0, 
      height != null ? parseInt(height.split()[0]) : null,
      weight != null ? parseInt(weight.split()[0]) : null, 
      playerTeam.name ? allTeams.find((team) => team[1] === playerTeam.name)[0] : null,
    ];
    allPlayers.push(desiredValues);
  }
  
  return allPlayers
}

function parseTimeData() {
  const timeData = fs.readFileSync('./processedData/teamsId.json');
  const allData = JSON.parse(timeData);
  const allTeams = [];

  for (let i = 0; i < allData.length; i++) {
    const {id, name} = allData[i];
    const desiredValues = [id, name, 0];
    allTeams.push(desiredValues);
  }

  return allTeams
}

function parseJogoData() {
  const jogoData = fs.readFileSync('./processedData/fixturesId.json');
  const allData = JSON.parse(jogoData);
  const allFixtures = [];

  for (let i = 0; i < allData.length; i++) {
    const {id} = allData[i];
    const {homeTeam, event_date, homeTeam_id, awayTeam_id, round} = allData[i].info;
    const desiredValues = [
      id,
      homeTeam,
      event_date,
      Number(homeTeam_id),
      Number(awayTeam_id),
      round
    ];
    allFixtures.push(desiredValues);
  }

  return allFixtures
}

function parseUserData() {
  const userData = fs.readFileSync('./processedData/usersId.json');
  const allData = JSON.parse(userData);
  const allUsers = [];

  for (let i = 0; i < allData.length; i++) {
    const {id, carteira, privacidade_do_perfil, cpf, nome, email} = allData[i];
    const desiredValues = [
      id,
      carteira,
      privacidade_do_perfil,
      cpf,
      nome,
      email
    ];
    allUsers.push(desiredValues);
  }

  return allUsers;
}

function parseApostaData() {
  const betData = fs.readFileSync('./processedData/betsId.json');
  const allData = JSON.parse(betData);
  const allBets = [];

  for (let i = 0; i < allData.length; i++) {
    const {id, valor, tipo, lucro_ou_perda, usuario, jogo} = allData[i];
    const desiredValues = [
      id,
      valor, 
      tipo, 
      lucro_ou_perda,
      usuario,
      jogo
    ];
    allBets.push(desiredValues);
  }

  return allBets;
}

const allTeams = parseTimeData();
const allPlayers = parseJogadorData(allTeams);
const allFixtures = parseJogoData();
const allUsers = parseUserData();
const allBets = parseApostaData();

populate_postgres(allTeams, allPlayers, allFixtures, allUsers, allBets);
