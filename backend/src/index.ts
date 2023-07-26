import useDatabase, { connectRedisClient } from "@/utils/database";
import { WebSocketServer, WebSocket, type RawData } from "ws";
import type { IncomingData } from "challenge-147-types";
import { init } from "@paralleldrive/cuid2";
import express from "express";

const app = express();
app.use(express.json());

const getCuid = init({
	length: 4,
});

/** Keeps track of if the server is ready to process incoming requests */
let connected = false;

/** Duration after which user can resend message */
const expireDuration = 60 * 15;

/** Amount of messages user can send in {expireDuration} time frame */
const limitAmount = 15;

const PORT = process.env.PORT || 5174;

// Headers to use for CORS check
const headers = {
	"Access-Control-Max-Age": 86400,
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "OPTIONS,GET,POST",
	"Access-Control-Allow-Credentials": "true",
};

// Intercept all incoming requests if the server is not ready
app.use((_, res, next) => {
	if (!connected) return res.sendStatus(418);
	next();
});

// CORS
app.use((req, res, next) => {
	Object.entries(headers).forEach(([k, v]) => {
		res.setHeader(k, v);
	});

	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

// Set up a headless websocket server that prints any events sent to it.
const wsServer = new WebSocketServer({ noServer: true });

const handleIncomingMessage = async function (this: WebSocket, data: RawData, isBinary: boolean) {
	const redis = useDatabase();
	const message: IncomingData = JSON.parse(data.toString());
	switch (message.event) {
		case "join":
			try {
				const [previousKeys] = await Promise.all([
					// This `previousData` data is being returned from here for future updates,
					// if decided to show user the remaining time to send messages
					redis.keys(`limit:${message.userId}:*`),
					redis.hSet(`user:${message.userId}`, {
						userId: message.userId,
						username: message.username,
						joinedAt: message.joinedAt,
						disconnected: message.disconnected,
					}),
				]);
				this.send(Buffer.from(JSON.stringify({ event: "limit", previousKeys })));
			} catch (err) {
				console.error("Failed saving user to redis...", err);
			}
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		case "left":
			try {
				await redis.hSet(`user:${message.userId}`, {
					disconnected: 1,
				});
			} catch (err) {
				console.error("Failed updating user status...", err);
			}
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		case "message":
			try {
				const previousKeys = await redis.keys(`limit:${message.from}:*`);
				console.log("Here", previousKeys);
				if (previousKeys.length === limitAmount) {
					return this.send(Buffer.from(JSON.stringify({ event: "limit", previousKeys })));
				}
				await Promise.all([
					redis.hSet(`message:${message.id}`, {
						id: message.id,
						from: message.from,
						value: message.value,
						timestamp: message.timestamp,
					}),
					redis.set(`limit:${message.from}:${getCuid()}:${message.timestamp}`, 1, {
						EX: expireDuration,
					}),
				]);
			} catch (err) {
				console.error("Failed saving message to redis...", err);
			}
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
	}
};

wsServer.on("connection", async (socket) => {
	socket.on("message", handleIncomingMessage);

	const redis = useDatabase();

	const [userIds, { keys: messageIds }] = await Promise.all([
		redis.keys(`user:*`),
		redis.scan(0, {
			MATCH: "message:*",
			COUNT: 50,
		}),
	]);

	const [users, messages] = await Promise.all([
		Promise.all(userIds.map((k) => redis.hGetAll(k))),
		Promise.all(messageIds.map((k) => redis.hGetAll(k))),
	]);

	socket.send(Buffer.from(JSON.stringify({ event: "connected", users, messages })));
});

// Start the normal HTTP server
const server = app.listen(PORT, async () => {
	try {
		await connectRedisClient();
		console.log(`Server started on port ${PORT}`);
		connected = true;
	} catch (err) {
		console.error("Failed connecting to database");
		process.exit(1);
	}
});

// Upgrade HTTP connection to WS with this request
server.on("upgrade", (request, socket, head) => {
	wsServer.handleUpgrade(request, socket, head, (socket) => {
		wsServer.emit("connection", socket, request);
	});
});

// Callback function to close redis connection on exiting app
const closeDatabaseConnection = async () => {
	const redis = useDatabase();
	try {
		await redis.disconnect();
		wsServer.clients.forEach((client) => {
			client.close();
		});
		process.exit(0);
	} catch (err) {
		console.error("Database connection not closed:", err);
		process.exit(1);
	}
};

process.on("SIGINT", closeDatabaseConnection);
process.on("SIGTERM", closeDatabaseConnection);
