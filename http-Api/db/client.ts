import { Client } from "pg";
//import 'dotenv/config'
import type { Order, Update } from "./types";
import type { MessageFromOrderbook } from "../types/Outgoing";

export const client = new Client(process.env.DATABASE_URL);

await client.connect();
console.log("pg client connected");

export async function insertOrder(data: Order) {
    try {
        await client.query(
            `INSERT INTO orders (id, type, price, qty, executedQty, status, userId, market) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [data.id, data.type, data.price, data.qty, 0, "open", data.userId, data.market]
        );
        console.log("inserted")
    } catch (e) {
        console.log("--------------------------------------------------")
        console.log(e)
    }
}

export async function updateOrder(data: MessageFromOrderbook) {

    switch (data.type) {
        case "ORDER_PLACED":
            try {
                    console.log(data.data)
                    await client.query(
                        `
                    UPDATE orders
                    SET
                         executedQty = $1,
                         status = $2
                    WHERE id = $3
                        `,
                        [
                            data.data.executedQty,
                            data.data.executedQty > 0 ? 'partiallyFilled' : 'filled',
                            data.data.orderId
                        ]
                    );
                
                console.log("inserted")
            } catch (e) {
                console.log(e)
            }
            break;

        case "ORDER_CANCELLED":
            try {
                    await client.query(
                        `
                    UPDATE orders
                    SET
                         executedQty = $1,
                         status = $2
                    WHERE id = $3
                        `,
                        [
                            data.data.executedQty,
                            'cancelled',
                            data.data.orderId
                        ]
                    );
            } catch (e) {
                console.log(e)
            }
    }

}







