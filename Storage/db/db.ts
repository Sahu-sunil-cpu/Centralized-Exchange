import { client } from "./client"

export async function InsertTrades(price: number, qty: number, pair: string, ts: string) {

    try {
        await client.query(
            `INSERT INTO trades (market, price, amount, time) VALUES ($1, $2, $3, $4)`,
            [pair, price, qty, ts]
        );
        console.log("inserted")
    }catch (e) {

    }

}

