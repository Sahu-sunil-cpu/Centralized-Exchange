import { createClient } from "redis";
import type { OutgoingMessage } from "../types/Outgoing";
//import { Aggregateohlvc } from "./db";

const client = createClient()
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log("aggregator redis client started");



export async function PublishStream(channel: string, message: OutgoingMessage) {
  await client.publish(channel, JSON.stringify(message));
  console.log("yes")
}
