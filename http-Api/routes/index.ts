import type { Request, Response } from "express";
import { RedisManager } from "../redis/RedisManager";
import { CREATE_ORDER } from "../types/Outgoing";


export async function PlaceOrder(req: Request, res: Response) {
 
        const { data } = req.body;
       // console.log(req.body);
    
        const client = new RedisManager();
    
        const response = await client.sendAndAwait({
            type: CREATE_ORDER,
            data: data
        })
        // response -> database
        // inserting into redis response and fill in order
    
    
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
