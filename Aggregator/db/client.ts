
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const client = new Pool({connectionString});

await client.connect()

console.log("pg client connected");
