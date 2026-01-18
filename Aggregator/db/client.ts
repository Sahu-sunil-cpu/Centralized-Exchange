import { Client } from "pg";
import 'dotenv/config'

export const client = new Client(process.env.DATABASE_URL);

await client.connect()

console.log("pg client connected");
