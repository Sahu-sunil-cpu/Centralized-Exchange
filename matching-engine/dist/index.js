"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueHandler = QueueHandler;
const Engine_1 = require("./engine/Engine");
const RedisManager_1 = require("./RedisManager");
const IncomingData_1 = require("./types/IncomingData");
const redis_1 = require("redis");
const engine = new Engine_1.Engine();
const client = (0, redis_1.createClient)();
const manager = new RedisManager_1.RedisManager();
// here websockets needed to be implemented
function QueueHandler(clientId, message) {
    // console.log(message)
    // console.log(message.data)
    switch (message.type) {
        case IncomingData_1.Actions.create_order:
            try {
                const data = message.data;
                console.log(data.side);
                const { executedQty, fills, orderId } = engine.createOrder(data.market, data.price, data.quantity, data.side, data.userId);
                manager.sendToApi(clientId, {
                    type: "ORDER_PLACED",
                    data: {
                        orderId,
                        executedQty,
                        fills
                    }
                });
            }
            catch (e) {
                console.log(e);
                // RedisManager.getInstance().sendToApi(clientId, {
                //     type: "ORDER_CANCELLED",
                //     data: {
                //         orderId: "",
                //         executedQty: 0,
                //         remainingQty: 0
                //     }
                // });
            }
            break;
        case IncomingData_1.Actions.cancel_order:
            const data = message.data;
            try {
                const orderId = data.orderId;
                const cancelMarket = data.market;
                const cancelOrderbook = engine.getOrderBook().find(o => o.ticker() === cancelMarket);
                const quoteAsset = cancelMarket.split("_")[1];
                if (!cancelOrderbook) {
                    throw new Error("No orderbook found");
                }
                const order = cancelOrderbook.asks.find(o => o.orderId === orderId) || cancelOrderbook.bids.find(o => o.orderId === orderId);
                if (!order) {
                    console.log("No order found");
                    throw new Error("No order found");
                }
                if (order.side === "buy") {
                    const price = cancelOrderbook.cancelBid(order);
                    const leftQuantity = (order.quantity - order.filled) * order.price;
                    //@ts-ignore
                    this.balances.get(order.userId)[BASE_CURRENCY].available += leftQuantity;
                    //@ts-ignore
                    this.balances.get(order.userId)[BASE_CURRENCY].locked -= leftQuantity;
                    if (price) {
                        engine.sendUpdatedDepthAt(price.toString(), cancelMarket);
                    }
                }
                else {
                    const price = cancelOrderbook.cancelAsk(order);
                    const leftQuantity = order.quantity - order.filled;
                    //@ts-ignore
                    this.balances.get(order.userId)[quoteAsset].available += leftQuantity;
                    //@ts-ignore
                    this.balances.get(order.userId)[quoteAsset].locked -= leftQuantity;
                    if (price) {
                        engine.sendUpdatedDepthAt(price.toString(), cancelMarket);
                    }
                }
                // RedisManager.getInstance().sendToApi(clientId, {
                //     type: "ORDER_CANCELLED",
                //     data: {
                //         orderId,
                //         executedQty: 0,
                //         remainingQty: 0
                //     }
                // });
            }
            catch (e) {
                console.log("Error hwile cancelling order");
                console.log(e);
            }
            break;
        case IncomingData_1.Actions.get_open_orders:
            const openOrderData = message.data;
            try {
                const openOrderbook = engine.getOrderBook().find(o => o.ticker() === openOrderData.market);
                if (!openOrderbook) {
                    throw new Error("No orderbook found");
                }
                const openOrders = openOrderbook.getOpenOrders(openOrderData.userId);
                // RedisManager.getInstance().sendToApi(clientId, {
                //     type: "OPEN_ORDERS",
                //     data: openOrders
                // }); 
            }
            catch (e) {
                console.log(e);
            }
            break;
        case IncomingData_1.Actions.on_ramp:
            const onRampData = message.data;
            const userId = onRampData.userId;
            const amount = Number(onRampData.amount);
            engine.onRamp(userId, amount);
            break;
        case IncomingData_1.Actions.get_depth:
            const depthData = message.data;
            try {
                const market = depthData.market;
                const orderbook = engine.getOrderBook().find(o => o.ticker() === market);
                if (!orderbook) {
                    throw new Error("No orderbook found");
                }
                // RedisManager.getInstance().sendToApi(clientId, {
                //     type: "DEPTH",
                //     data: orderbook.getDepth()
                // });
            }
            catch (e) {
                console.log(e);
                // RedisManager.getInstance().sendToApi(clientId, {
                //     type: "DEPTH",
                //     data: {
                //         bids: [],
                //         asks: []
                //     }
                // });
            }
            break;
    }
}
function StartEngine() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("matching engine is running");
            while (true) {
                try {
                    const response = yield client.brPop("messages", 0);
                    const element = response === null || response === void 0 ? void 0 : response.element;
                    console.log(element);
                    const { clientId, message } = JSON.parse(element);
                    yield QueueHandler(clientId, message);
                }
                catch (error) {
                    console.error("error while popping elements from queue");
                }
            }
        }
        catch (error) {
            console.error("error connecting to redis");
        }
    });
}
StartEngine();
