import { Router } from "express";
// import { globalRouter } from ".";
import { RedisManager } from "../redis/RedisManager";
import { CANCEL_ORDER, CREATE_ORDER } from "../types/Outgoing";
import { getRandom } from "../utils";
import { getDepth, PlaceOrder } from ".";


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
globalRouter.post("/order", (req, res) => {
    PlaceOrder(req, res);
})


globalRouter.get("/depth/:market", (req, res) => {
    getDepth(req, res);
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