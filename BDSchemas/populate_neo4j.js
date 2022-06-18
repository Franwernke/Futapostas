import neo4j from "neo4j-driver";
import fileSystem from "fs";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;

const Nodes = {
  Jogo: { fields: ["Codigo", "Data", "Resultado"] },
  Usuario: { fields: ["Codigo", "Email"] },
};

const Arcs = {
  APOSTA: { fields: ["Codigo", "Valor"] },
  CARTAO_AMARELO: { fields: ["Numero"] },
  CARTAO_VERMELHO: { fields: ["Numero"] },
  TIME: { fields: ["Resultado"] },
  GOLS: { fields: ["Numero"] },
  TITULAR: { fields: ["Presenca", "CodigoDoJogador"] },
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
    objectAsString += `${key}: `;
    if (["number", "boolean"].includes(typeof object[key])) {
      objectAsString += `${object[key]}, `;
    } else {
      objectAsString += `"${object[key]}", `;
    }
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

  const query = `MERGE (:${nodeLabel} ${stringify(row)})`;

  await session.run(query);
  fileSystem.appendFileSync("populate_neo4j.cypher", query + ";\n");

  return true;
};

const insertArc = async (session, arc, arcLabels, firstNode, secondNode) => {
  const fields = arcLabels
    .split(":")
    .map((label) => Arcs[label]?.fields || [])
    .reduce((allFields, currentFields) => [...allFields, ...currentFields]);

  if (!fields) {
    console.log("ALERTA @ insertArc - Inserção não sucedeu por não ter campos");
    return false;
  }

  if (Object.keys(arc).some((key) => !fields.includes(key))) {
    console.log("ALERTA @ insertArc - Inserção não sucedeu por falta de campos");
    console.log("\tEsperado: " + fields.join(", "));
    console.log("\tObtido: " + Object.keys(arc).join(", "));
    return false;
  }

  const parsedArcLabels = `:${arcLabels.split(":").slice(1).join("_")}`;

  const query = `
    MATCH \n\t(a${firstNode.label}),\n\t(b${secondNode.label}) \nWHERE a.${firstNode.key} = ${firstNode.value} AND\n\t  b.${secondNode.key} = ${secondNode.value} \nMERGE (a)-[${parsedArcLabels} ${stringify(arc)}]->(b)
    `.trim();

  await session.run(query);
  fileSystem.appendFileSync("populate_neo4j.cypher", query + ";\n");

  return true;
};

const parseUsersData = () => {
  const buffer = fileSystem.readFileSync("./processedData/usersId.json");

  if (!buffer) {
    return;
  }

  return JSON.parse(buffer.toString()).map((user) => ({
    Codigo: user.id,
    Email: user.email,
  }));
};

const parseResult = (game) => {
  const score = game.info.final_score.split(" - ");

  if (score[0] === score[1]) {
    return "empate";
  }

  if (score[0] > score[1]) {
    return Number(game.info.homeTeam_id);
  }

  return Number(game.info.awayTeam_id);
};

const parseGamesData = () => {
  const buffer = fileSystem.readFileSync("./processedData/fixturesId.json");

  if (!buffer) {
    return;
  }

  return JSON.parse(buffer.toString()).map((game) => ({
    Codigo: game.id,
    Data: game.info.event_date,
    Resultado: parseResult(game),
  }));
};

const getBetLabel = (bet) => {
  switch (bet["tipo"]) {
    case "escalação":
      return ":APOSTA:TITULAR";
    case "time_vencedor":
    case "empate":
      return ":APOSTA:TIME";
    default:
      console.log("ERRO @ betToArc - Tipo de aposta não reconhecido");
      process.exit();
  }
};

const betToArc = (bet) => {
  const commonFields = {
    Codigo: bet["id"],
    Valor: bet["valor"],
  };

  switch (bet["tipo"]) {
    case "escalação":
      return {
        ...commonFields,
        CodigoDoJogador: bet["referencia"],
        Presenca: true,
      };
    case "time_vencedor":
      return {
        ...commonFields,
        Resultado: bet["referencia"],
      };
    case "empate":
      return {
        ...commonFields,
        Resultado: "empate",
      };
    default:
      console.log("ERRO @ getBetLabel - Tipo de aposta não reconhecido");
      process.exit();
  }
};

const parseBetsData = () => {
  let buffer;

  try {
    buffer = fileSystem.readFileSync("./processedData/betsId.json");
  } catch (error) {
    console.log("ERRO @ parseBetsData - Não foi possível ler o arquivo");
    return [];
  }

  const bets = JSON.parse(buffer.toString());

  return bets.map((bet) => ({
    arc: betToArc(bet),
    label: getBetLabel(bet),
    firstNode: {
      label: ":Usuario",
      key: "Codigo",
      value: bet["usuario"],
    },
    secondNode: {
      label: ":Jogo",
      key: "Codigo",
      value: bet["jogo"],
    },
  }));
};

const insertUsers = async (session) => {
  const users = parseUsersData();

  for (const user of users) {
    await insertNode(session, user, "Usuario");
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

  fileSystem.appendFileSync("./populate_neo4j.cypher", "// INSERINDO USUÁRIOS\n\n");
  await insertUsers(session);
  fileSystem.appendFileSync("./populate_neo4j.cypher", "\n// INSERINDO JOGOS\n\n");
  await insertGames(session);
  fileSystem.appendFileSync("./populate_neo4j.cypher", "\n// INSERINDO APOSTAS\n\n");
  await insertBets(session);

  closeConnection(session);

  process.exit();
};

await populateDatabase();
