import fileSystem from "fs";
import redis from "redis";

const USER = process.env.REDIS_USER;
const PASSWORD = process.env.REDIS_PASSWORD;
const HOST = process.env.REDIS_HOST;
const PORT = process.env.REDIS_PORT;

const REVIEW_PAGE_SIZE = 20;

const getConnection = async () => {
  const client = redis.createClient(
    USER &&
      PASSWORD &&
      HOST &&
      PORT && {
        url: `redis://${USER}:${PASSWORD}@${HOST}:${PORT}`,
      }
  );

  client.on("error", (error) => {
    console.log("ERRO @ getConnection - " + error);
  });

  await client.connect();

  return client;
};

const scapeCommas = text => {
  return text.replace(/"/g, `\\"`);
};

const set = async (client, key, value) => {
  if (!key) {
    console.log(`ERRO @ set - Sem chave`);
    return false;
  }

  // await client.set(key, value);
  fileSystem.appendFileSync(
    "./populate_redis.redis", 
    `set ${key} "${scapeCommas(value)}";\n`
  );

  return true;
};

const parseUsers = () => {
  let buffer;

  try {
    buffer = fileSystem.readFileSync("./processedData/usersId.json");
  } catch (error) {
    console.log("ERRO @ parseUsers - Não foi possível ler o arquivo");
    return [];
  }

  return JSON.parse(buffer.toString()).map((user) => ({
    Email: user.email,
    Senha: user.nome.split(" ")[0].toLowerCase(),
  }));
};

const parseReviews = () => {
  let buffer;

  try {
    buffer = fileSystem.readFileSync("./processedData/reviewsId.json");
  } catch (error) {
    console.log("ERRO @ parseReviews - Não foi possível ler o arquivo");
    return [];
  }

  return JSON.parse(buffer.toString());
};

const storeUsersCredentials = async (client, users) => {
  for (const user of users) {
    await set(client, user.Email, user.Senha);
  }
};

const storeReviews = async (client, reviews) => {
  const entities = {
    games: {},
    teams: {},
    players: {}
  };

  for (const review of reviews) {
    const referenceType = review.tipo + "s";
    const reference = review["referencia"];
    
    if (entities[referenceType][reference]) {
      entities[referenceType][reference].push(review);
    } else {
      entities[referenceType][reference] = [review];
    }
  }

  for (const entityType in entities) {
    for (const entityKey in entities[entityType]) {
      const entityReviews = entities[entityType][entityKey];

      const totalPages = Math.floor(entityReviews.length / REVIEW_PAGE_SIZE) + 1;

      for (let page = 1; page <= totalPages; page++) {
        const reviewsPage = entityReviews.slice(
          (page - 1) * REVIEW_PAGE_SIZE,
          page * REVIEW_PAGE_SIZE,
        );

        const parsedReviewsPage = JSON.stringify(reviewsPage.map(review => ({
          "codigo": review["codigo"],
          "codigoUsuario": review["codigoUsuario"],
          "comentario": review["comentario"],
          "data": review["data"],
          "referencia": review["referencia"],
        })));

        set(
          client,
          entityType + "-" + entityKey + "-reviews" +  "-" + page,
          parsedReviewsPage
        );
      }
    }
  }
};

const populateRedis = async () => {
  const client = await getConnection();

  const users = parseUsers();
  const reviews = parseReviews();

  fileSystem.appendFileSync("./populate_redis.redis", "// INSERINDO USUÁRIOS\n\n");
  await storeUsersCredentials(client, users);
  fileSystem.appendFileSync("./populate_redis.redis", "\n// INSERINDO RESENHAS\n\n");
  await storeReviews(client, reviews);

  process.exit();
};

populateRedis();
