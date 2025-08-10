import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { appRouter } from "./api/root";
import { db } from "./db";

const wss = new WebSocketServer({
	port: 3001,
});

const handler = applyWSSHandler({
	wss,
	router: appRouter,
	createContext: () => ({
		headers: new Headers(),
		db,
	}),
});

wss.on("connection", (ws) => {
	console.log(`➕➕ Connection (${wss.clients.size})`);
	ws.once("close", () => {
		console.log(`➖➖ Connection (${wss.clients.size})`);
	});
});

console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
	console.log("SIGTERM");
	handler.broadcastReconnectNotification();
	wss.close();
});

export { wss };
