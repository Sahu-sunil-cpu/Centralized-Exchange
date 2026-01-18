import type { Request, Response } from "express";
import { RedisManager } from "../redis/RedisManager";
import { CREATE_ORDER } from "../types/Outgoing";
import { client, insertOrder, updateOrder } from "../db/client"
import { generateId } from "../utils";


export async function PlaceOrder(req: Request, res: Response) {

    const { data } = req.body;
    // console.log(req.body);
    const id = generateId();

    const client = new RedisManager();



    insertOrder({
            market: data.market,
            price: data.price,
            qty: data.quantity,
            type: data.side,
            userId: data.userId,
            id: id
        })

    const response = await client.sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market: data.market,
            price: data.price,
            quantity: data.quantity,
            side: data.side,
            userId: data.userId.toString(),
            orderId: id
        }
    })
    // response -> database
    // inserting into redis response and fill in order
    updateOrder(response);

    res.send(
        response
    )
}

export async function getDepth(req: Request, res: Response) {

    //     const { data } = req.body;
    //    // console.log(req.body);

    //     const client = new RedisManager();

    //     const response = await client.sendAndAwait({
    //         type: CREATE_ORDER,
    //         data: data
    //     })
    //     // response -> database
    //     // inserting into redis response and fill in order


    res.send(
        "response"
    )
}
