import pg from 'pg'
import fs from 'fs'

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
  if (!values.length || values.length !== numOfValues) {
    console.log("Insira somente 7 valores!!!");
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

async function populate_postgres(allPlayers) {
  const db = await connect();

  allPlayers.forEach(player => {
    insertRow(db, 'jogador', player, 7)    
  });
}

function parseJogadorData() {
  const jogadorData = fs.readFileSync('./processedData/playersId.json');
  const allData = JSON.parse(jogadorData);
  const allPlayers = [];
  
  for (let i = 0; i < allData.length; i++) {
    const {id, name, birth, height, weight} = allData[i].player;
    const desiredValues = [id, name, birth.date, birth.place, 0, height != null ? parseInt(height.split()[0]) : null, 
                            weight != null ? parseInt(weight.split()[0]) : null];
    allPlayers.push(desiredValues);
  }
  
  return allPlayers
}

function parseTimeData() {
  const jogadorData = fs.readFileSync('./processedData/playersId.json');
  const allData = JSON.parse(jogadorData);
  const allPlayers = [];
  
  for (let i = 0; i < allData.length; i++) {
    const {id, name, birth, height, weight} = allData[i].player;
    const desiredValues = [id, name, birth.date, birth.place, 0, height != null ? parseInt(height.split()[0]) : null, 
                            weight != null ? parseInt(weight.split()[0]) : null];
    allPlayers.push(desiredValues);
  }
  
  return allPlayers
}

populate_postgres(parseJogadorData())
