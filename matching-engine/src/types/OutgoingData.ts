
import { z } from "zod";

export type MessageToApi = {
    type: "ORDER_PLACED",
    data: placeOrderType
}

export type MessageToWs = {
    type: "ORDER_UPDATE",
    data: orderUpdateType
}

const placeOrder = z.object({
    orderId: z.string(),
    executedQty: z.number(),  // can be changed into ticker specific rooms
    fills: z.array(z.object({
        price: z.string(),
        qty: z.number(),
        tradeId: z.number()
    }))
})

export type placeOrderType = z.infer<typeof placeOrder>;

const orderUpdate = z.object({
    orderId: z.string(),
    executedQty: z.number(),
    market: z.string(),
    price: z.number(),
    quantity: z.number(),
    side: z.string()
})

export type orderUpdateType = z.infer<typeof orderUpdate>;


export type WsType = {
    stream: string,
    data: {
        e: string,
        t: number,
        m: boolean,
        p: string,
        q: string,
        s: string,
    }
} | {
    stream: string,
    data: {
        a: [string, string][],
        b: [string, string][],
        e: string
    }
}