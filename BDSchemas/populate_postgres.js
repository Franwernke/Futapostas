import pg from 'pg'
import fs from 'fs'

const Tables = {
  jogador: {name: 'jogador', numOfFields: 8},
  time: {name: 'time', numOfFields: 3},
  jogo: {name: 'jogo', numOfFields: 6},
  usuario: {name: 'usuario', numOfFields: 6},
  apostas: {name: 'apostas', numOfFields: 4},
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
  console.log(`INSERT INTO ${table} VALUES (${valueIndexes})`);
  const res = await db.query(`INSERT INTO ${table} VALUES (${valueIndexes})`, values);
  console.log(res.rows[0]);  
}

async function populate_postgres(allTeams, allPlayers, allFixtures, allUsers) {
  const db = await connect();
  
  allTeams.forEach(team => insertRow(db, Tables.time.name, team, Tables.time.numOfFields));
  allPlayers.forEach(player => insertRow(db, Tables.jogador.name, player, Tables.jogador.numOfFields));
  allFixtures.forEach(fixture => insertRow(db, Tables.jogo.name, fixture, Tables.jogo.numOfFields));
  allUsers.forEach(user => insertRow(db, Tables.usuario.name, user, Tables.usuario.numOfFields));
}

function parseJogadorData(allTeams) {
  const jogadorData = fs.readFileSync('./processedData/playersId.json');
  const allData = JSON.parse(jogadorData);
  const allPlayers = [];
  
  for (let i = 0; i < allData.length; i++) {
    const id = allData[i].id;
    const {name, birth, height, weight} = allData[i].info;
    const { team: playerTeam } = allData[i].statistics[0]
    console.log(playerTeam.name);
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

  return allUsers
}

const allTeams = parseTimeData();
const allPlayers = parseJogadorData(allTeams);
const allFixtures = parseJogoData();
const allUsers = parseUserData();

populate_postgres(allTeams, allPlayers, allFixtures, allUsers);
