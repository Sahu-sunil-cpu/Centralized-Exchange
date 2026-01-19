import { WebSocketServer } from "ws";
import { UserManager } from "./user/UserManager";

const wss = new WebSocketServer({ port: 8081 });

console.log("ws-pusher started");
wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws);
});

