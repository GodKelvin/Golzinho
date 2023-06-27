import { createClient } from "redis";

const redisClient = createClient({url: process.env.REDIS_URL});

redisClient.on('connect', () => {
    console.log('--Redis server connected');
});
  
redisClient.on('error', (err) => {
    console.error(`>> Error connecting to Redis server: ${err}`);
});

export default redisClient;