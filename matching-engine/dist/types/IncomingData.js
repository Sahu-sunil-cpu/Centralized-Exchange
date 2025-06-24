"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = void 0;
const zod_1 = require("zod");
var Actions;
(function (Actions) {
    Actions["join_room"] = "JOIN_ROOM";
    Actions["create_order"] = "CREATE_ORDER";
    Actions["get_depth"] = "GET_DEPTH";
    Actions["cancel_order"] = "CANCEL_ORDER";
    Actions["get_open_orders"] = "GET_OPEN_ORDERS";
    Actions["on_ramp"] = "ON_RAMP";
})(Actions || (exports.Actions = Actions = {}));
var OrderAction;
(function (OrderAction) {
    OrderAction["bid"] = "bid";
    OrderAction["ask"] = "ask";
})(OrderAction || (OrderAction = {}));
const JoinRoomSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    roomId: zod_1.z.string(), // can be changed into ticker specific rooms
});
const GetOrderSchema = zod_1.z.object({
    price: zod_1.z.string(),
    quantity: zod_1.z.string(),
    side: zod_1.z.enum(["buy", "sell"]),
    market: zod_1.z.string(),
    userId: zod_1.z.string(),
});
const GetDepthSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    roomId: zod_1.z.string(),
    market: zod_1.z.string()
});
const GetCancelOrderSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    roomId: zod_1.z.string(),
    market: zod_1.z.string(),
    orderId: zod_1.z.string()
});
const GetOpenOrdersSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    roomId: zod_1.z.string(),
    market: zod_1.z.string()
});
const OnRampSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    roomId: zod_1.z.string(),
    amount: zod_1.z.string(),
    txnId: zod_1.z.string(),
});
