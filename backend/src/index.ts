import useDatabase, { connectRedisClient } from "@/utils/database";
import { WebSocketServer, WebSocket, type RawData } from "ws";
import type { IncomingData } from "challenge-147-types";
import express from "express";

const app = express();
app.use(express.json());

/** Keeps track of if the server is ready to process incoming requests */
let connected = false;

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

const handleIncomingMessage = function (this: WebSocket, data: RawData, isBinary: boolean) {
	const message: IncomingData = JSON.parse(data.toString());
	switch (message.event) {
		case "join":
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		case "left":
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		case "message":
			return wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
	}
};

wsServer.on("connection", (socket) => {
	socket.on("message", handleIncomingMessage);
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
