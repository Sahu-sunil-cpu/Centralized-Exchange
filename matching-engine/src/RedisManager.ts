import { createClient, type RedisClientType } from "redis";
import { MessageToApi, MessageToWs, WsType } from "./types/OutgoingData";

export class RedisManager {
    private client: RedisClientType;

     constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public sendToApi(clientId: string, message: MessageToApi) {
      
        try {
            this.client.lPush(clientId, JSON.stringify(message));
        } catch (error) {
            console.error("Redis error: pushing error", error);
        }
    }

    public sendToWs(channel: string, message: WsType) {
   try {
            this.client.lPush("channel", JSON.stringify(message));
        } catch (error) {
            console.error("Redis error: pushing error ws", error);
        }
    }


}
