import { createClient, type RedisClientType } from "redis";
import app from "../../package.json";

let client: RedisClientType;

export const connectRedisClient = async () => {
	client = createClient({
		url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
		name: app.name,
	});
	await client.connect();
};

const useDatabase = () => {
	return client;
};

export default useDatabase;
