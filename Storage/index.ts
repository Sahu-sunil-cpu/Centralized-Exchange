import { createClient } from "redis";
import { InsertTrades } from "./db/db";

const client = createClient()
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log("storage redis client started");


export type MessageType = {
    stream: string,
    data: {
        e: "trade",
        t: number,
        m: boolean,
        p: string,
        q: string,
        s: string,
    }
}

async function ListenToStream() {
    while (true) {
        try {
            const response = await client.brPop("channel_storage", 0);
            const element = response?.element as string;
            console.log(element)

            const msg: MessageType = JSON.parse(element);

            console.log(msg)
            if (!msg) {
                return;
            }

            const price = Number(msg.data.p);
            const pair = "TATA_INR"
            const qty = Number(msg.data.q);
            const ts = new Date().toISOString();

            await InsertTrades(price, qty, pair, ts)

        } catch (error) {
            console.error("error while popping elements from queue");
        }
    }
}


// CreateGroup();
ListenToStream();
