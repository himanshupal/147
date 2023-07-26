import type { IncomingData, MessageSent, UserJoined } from "challenge-147-types";
import { createId } from "@paralleldrive/cuid2";
import { WebSocket } from "ws";
import { expect } from "chai";
import { test } from "mocha";

const userId = createId();

/** Amount of messages user can send in {expireDuration} time frame */
const limitAmount = 15;

test("Join", function () {
	const client = new WebSocket("ws://127.0.0.1:5174");

	client.on("message", (data) => {
		const message: IncomingData = JSON.parse(data.toString());
		if (message.event === "message") {
			client.close();
		} else {
			expect(message.event).to.match(/limit|connected|join/);
		}
	});

	const userJoined: UserJoined = {
		userId,
		event: "join",
		username: "tester",
		disconnected: "0",
		joinedAt: Date.now(),
	};

	client.on("open", () => {
		client.send(Buffer.from(JSON.stringify(userJoined)));
	});
});

test("Limit", function () {
	const client = new WebSocket("ws://127.0.0.1:5174");
	let count = 0;

	client.on("message", (data) => {
		const message: IncomingData = JSON.parse(data.toString());
		if (message.event === "message") {
			if (message.from === userId) {
				count += 1;
				expect(message.value).eq(`Message ${count} from tester`);
			}
		} else if (count === limitAmount) {
			expect(message.event).eq("limit");
			client.close();
		}
	});

	const sendMessages = () => {
		for (let i = 0; i <= 15; i++) {
			const message: MessageSent = {
				id: createId(),
				from: userId,
				event: "message",
				timestamp: Date.now(),
				value: `Message ${i + 1} from tester`,
			};
			client.send(Buffer.from(JSON.stringify(message)));
		}
	};

	client.on("open", sendMessages);
});

test("Multiple concurrent users", function () {
	const client = new WebSocket("ws://127.0.0.1:5174");
	const users = Array.from({ length: 50 }, () => createId());
	let count = 0;

	client.on("message", (data) => {
		const message: IncomingData = JSON.parse(data.toString());
		if (message.event === "message") {
			if (message.from === userId) return;
			expect(message.from).eq(users[count]);
			if (count === 49) {
				client.close();
			} else {
				count += 1;
			}
		}
	});

	const sendMessages = () => {
		users.forEach((userId, i) => {
			const message: MessageSent = {
				id: createId(),
				from: userId,
				event: "message",
				timestamp: Date.now(),
				value: `Message ${i + 1} from ${userId}`,
			};
			client.send(Buffer.from(JSON.stringify(message)));
		});
	};

	client.on("open", sendMessages);
});
