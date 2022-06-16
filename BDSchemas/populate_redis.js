import fileSystem from "fs";
import redis from "redis";

const USER = process.env.REDIS_USER;
const PASSWORD = process.env.REDIS_PASSWORD;
const HOST = process.env.REDIS_HOST;
const PORT = process.env.REDIS_PORT;

const getConnection = async () => {
  const client = redis.createClient((USER && PASSWORD && HOST && PORT) && {
    url: `redis://${USER}:${PASSWORD}@${HOST}:${PORT}`
  });

  client.on("error", (error) => {
    console.log("ERRO @ getConnection - " + error);
  });

  await client.connect();

  return client;
};

const set = async (client, key, value) => {
  if (!key) {
    console.log(`ERRO @ set - Sem chave`);
    return false;
  }

  await client.set(key, value);

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

  return JSON.parse(buffer.toString()).map(user => ({
    Email: user.email,
    Senha: user.nome.split(" ")[0].toLowerCase()
  }));
};

const storeUsersCredentials = async (client, users) => {
  for (const user of users) {
    await set(client, user.Email, user.Senha);
  }
};

const populateRedis = async () => {
  const client = await getConnection();

  const users = parseUsers();

  await storeUsersCredentials(client, users);

  process.exit();
};

populateRedis();