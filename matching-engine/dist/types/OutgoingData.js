"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const placeOrder = zod_1.z.object({
    orderId: zod_1.z.string(),
    executedQty: zod_1.z.number(), // can be changed into ticker specific rooms
    fills: zod_1.z.array(zod_1.z.object({
        price: zod_1.z.string(),
        qty: zod_1.z.number(),
        tradeId: zod_1.z.number()
    }))
});
const orderUpdate = zod_1.z.object({
    orderId: zod_1.z.string(),
    executedQty: zod_1.z.number(),
    market: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number(),
    side: zod_1.z.string()
});
