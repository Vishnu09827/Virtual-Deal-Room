const redis = require("redis");
const { promisify } = require("util");

const connectRedis = () => {
  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  client.on("error", (err) => {
    console.error("Redis error:", err);
  });

  client.on("connect", () => {
    console.log("Connected to Redis");
  });

  // Promisify Redis functions
  client.getAsync = promisify(client.get).bind(client);
  client.setAsync = promisify(client.set).bind(client);
  client.delAsync = promisify(client.del).bind(client);

  return client;
};

module.exports = connectRedis;
