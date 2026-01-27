import { createClient } from "redis";
import type { OutgoingMessage } from "../types/Outgoing";
//import { Aggregateohlvc } from "./db";

const redis_url = process.env.REDIS_URL;
if(!redis_url) throw new Error("REDIS_URL is not set")
const client = createClient({
  url: redis_url
})
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log("aggregator redis client started");



export async function PublishStream(channel: string, message: OutgoingMessage) {
  await client.publish(channel, JSON.stringify(message));
  console.log("yes")
}
