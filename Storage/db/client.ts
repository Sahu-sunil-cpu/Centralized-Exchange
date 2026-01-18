import { Client } from "pg";
import 'dotenv/config'

console.log(process.env.DATABASE_URL)
export const client = new Client('postgresql://neondb_owner:npg_3e8LMfRFGDEK@ep-red-cell-ahbatetf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

await client.connect()

console.log("pg client connected");
