import { Router } from "express";
// import { globalRouter } from ".";
import { RedisManager } from "../redis/RedisManager";
import { CANCEL_ORDER, CREATE_ORDER } from "../types/Outgoing";
import { getRandom } from "../utils";


type OrderType = "limit" | "market";
type kind = "but" | "sell";

interface Order {
    type: OrderType,
    kind: kind,
    price: number,
    quantity: number,
    market: string      // string needed to be converted into type of tickers

}

export const globalRouter = Router();
globalRouter.post("/order", async (req, res) => {
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
})


globalRouter.delete("/order", (req, res) => {
    const { orderId, market } = req.body;
    const response = new RedisManager();
    response.sendAndAwait({
        type: CANCEL_ORDER,
        data: {
            orderId,
            market,
        }
    })
    res.send("deleted");
})

globalRouter.get("/", (req, res) => {
    res.send("hi")
})