import neo4j from "neo4j-driver";
import fileSystem from "fs";

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;

const Nodes = {
  Jogo: { fields: ["Data", "Resultado"] },
  Usuário: { fields: ["Email"] },
};

const Arcs = {
  APOSTA: { fields: ["Valor"] },
  CARTÃO_AMARELO: { fields: ["Número"] },
  CARTÃO_VERMELHO: { fields: ["Número"] },
  TIME: { fields: ["Resultado"] },
  GOLS: { fields: ["Número"] },
  TITULAR: { fields: ["Presença", "CódigoDoJogador"] },
};

const getConnection = () => {
  if (!USER || !PASSWORD) {
    console.log("ERRO @ getConnection - Impossível conectar sem credenciais");
    return;
  }

  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

  return driver.session();
};

const closeConnection = async (session) => {
  session.close();
};

const stringify = (object) => {
  let objectAsString = "{ ";

  for (const key in object) {
    objectAsString += `${key}: "${object[key]}", `;
  }

  return objectAsString.slice(0, -2) + " }";
};

const insertNode = async (session, row, nodeLabel) => {
  const fields = Nodes[nodeLabel]?.fields;

  if (!fields) {
    console.log(`ERRO @ insertNode - O nó de etiqueta ${nodeLabel} não existe`);
    return false;
  }

  if (Object.keys(row).some((key) => !fields.includes(key))) {
    console.log(`ERRO @ insertNode - Faltaram campos para inserir o nó`);
    console.log(`\tEsperava os campos ${fields}`);
    console.log(`\tObtive os campos ${Object.keys(row)}`);
    return false;
  }

  const emptyField = Object.keys(row).find((key) =>
    [undefined, null].includes(row[key])
  );

  if (emptyField) {
    console.log(`ERRO @ insertNode - O campo ${emptyField} está vazio`);
    return false;
  }

  await session.run(`MERGE (:${nodeLabel} ${stringify(row)})`);

  return true;
};

const insertArc = async (session, arc, arcLabel, firstNode, secondNode) => {
  const fields = Arcs[arcLabel]?.fields;

  if (!fields) {
    return false;
  }

  if (Object.keys(row).some((key) => !fields.includes(key))) {
    return false;
  }

  await session.run(
    `
      MATCH 
        (a:${firstNode.label}),
        (b:${secondNode.label})
      WHERE a.${firstNode.key} = ${firstNode.value} AND
            B${secondNode.key} = ${secondNode.value}
      MERGE (a)-[:${arcLabel} ${JSON.stringify(arc)}]->(b)
    `
  );

  return true;
};

const parseUsersData = () => {
  const buffer = fileSystem.readFileSync("./processedData/usersId.json");

  if (!buffer) {
    return;
  }

  return JSON.parse(buffer.toString()).map(user => ({
    "Email": user.email
  }));
};

const parseGamesData = () => {
  const buffer = fileSystem.readFileSync("./processedData/fixturesId.json");

  if (!buffer) {
    return;
  }

  return JSON.parse(buffer.toString()).map((game) => ({
    "Data": game.info.event_date,
    "Resultado": game.info.final_score,
  }));
};

const parseBetsData = () => {
  console.log("ERRO @ parseBetsData - Nada aqui");
};

const insertUsers = async (session) => {
  const users = parseUsersData();

  for (const user of users) {
    await insertNode(session, user, "Usuário");
  }
};

const insertGames = async (session) => {
  const games = parseGamesData();

  for (const game of games) {
    await insertNode(session, game, "Jogo");
  }
};

const insertBets = async (session) => {
  const bets = parseBetsData();

  for (const bet of bets) {
    await insertArc(session, bet.arc, bet.label, bet.firstNode, bet.secondNode);
  }
};

const populateDatabase = async () => {
  const session = getConnection();

  if (!session) {
    process.exit();
  }

  await insertUsers(session);
  await insertGames(session);
  // await insertBets(session);

  closeConnection(session);

  process.exit();
};

await populateDatabase();
