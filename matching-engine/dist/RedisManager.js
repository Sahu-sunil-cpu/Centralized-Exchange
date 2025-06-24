"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const redis_1 = require("redis");
class RedisManager {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.client.connect();
    }
    sendToApi(clientId, message) {
        try {
            this.client.lPush(clientId, JSON.stringify(message));
        }
        catch (error) {
            console.error("Redis error: pushing error", error);
        }
    }
    sendToWs(channel, message) {
        try {
            this.client.lPush("channel", JSON.stringify(message));
        }
        catch (error) {
            console.error("Redis error: pushing error ws", error);
        }
    }
}
exports.RedisManager = RedisManager;
