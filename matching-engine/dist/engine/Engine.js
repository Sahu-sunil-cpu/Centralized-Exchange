"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.BASE_CURRENCY = void 0;
const fs_1 = __importDefault(require("fs"));
const orderbook_1 = require("./orderbook");
const RedisManager_1 = require("../RedisManager");
//TODO: Avoid floats everywhere, use a decimal similar to the PayTM project for every currency
exports.BASE_CURRENCY = "INR";
const manager = new RedisManager_1.RedisManager();
class Engine {
    constructor() {
        this.orderbooks = [];
        this.balances = new Map();
        let snapshot = null;
        try {
            if (process.env.WITH_SNAPSHOT) {
                snapshot = fs_1.default.readFileSync("./snapshot.json");
            }
        }
        catch (e) {
            console.log("No snapshot found");
        }
        if (snapshot) {
            const snapshotSnapshot = JSON.parse(snapshot.toString());
            this.orderbooks = snapshotSnapshot.orderbooks.map((o) => new orderbook_1.Orderbook(o.baseAsset, o.bids, o.asks, o.lastTradeId, o.currentPrice));
            // this.balances = new Map(snapshotSnapshot.balances);
        }
        else {
            this.orderbooks = [new orderbook_1.Orderbook(`TATA`, [], [], 0, 0)];
            this.setBaseBalances();
        }
    }
    addOrderbook(orderbook) {
        this.orderbooks.push(orderbook);
    }
    createOrder(market, price, quantity, side, userId) {
        console.log(this.orderbooks);
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];
        if (!orderbook) {
            throw new Error("No orderbook found");
        }
        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, quoteAsset, price, quantity);
        const order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            filled: 0,
            side,
            userId
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);
        this.createDbTrades(fills, market, userId);
        this.updateDbOrders(order, executedQty, fills, market);
        this.publisWsDepthUpdates(fills, price, side, market);
        this.publishWsTrades(fills, userId, market);
        return { executedQty, fills, orderId: order.orderId };
    }
    updateDbOrders(order, executedQty, fills, market) {
        // RedisManager.getInstance().pushMessage({
        //     type: ORDER_UPDATE,
        //     data: {
        //         orderId: order.orderId,
        //         executedQty: executedQty,
        //         market: market,
        //         price: order.price.toString(),
        //         quantity: order.quantity.toString(),
        //         side: order.side,
        //     }
        // });
        fills.forEach(fill => {
            // RedisManager.getInstance().pushMessage({
            //     type: ORDER_UPDATE,
            //     data: {
            //         orderId: fill.markerOrderId,
            //         executedQty: fill.qty
            //     }
            // });
        });
    }
    createDbTrades(fills, market, userId) {
        fills.forEach(fill => {
            // RedisManager.getInstance().pushMessage({
            //     type: TRADE_ADDED,
            //     data: {
            //         market: market,
            //         id: fill.tradeId.toString(),
            //         isBuyerMaker: fill.otherUserId === userId, // TODO: Is this right?
            //         price: fill.price,
            //         quantity: fill.qty.toString(),
            //         quoteQuantity: (fill.qty * Number(fill.price)).toString(),
            //         timestamp: Date.now()
            //     }
            // });
        });
    }
    publishWsTrades(fills, userId, market) {
        fills.forEach(fill => {
            manager.sendToWs(`trade@${market}`, {
                stream: `trade@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.otherUserId === userId, // TODO: Is this right?
                    p: fill.price,
                    q: fill.qty.toString(),
                    s: market,
                }
            });
        });
    }
    sendUpdatedDepthAt(price, market) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) {
            return;
        }
        const depth = orderbook.getDepth();
        const updatedBids = depth === null || depth === void 0 ? void 0 : depth.bids.filter(x => x[0] === price);
        const updatedAsks = depth === null || depth === void 0 ? void 0 : depth.asks.filter(x => x[0] === price);
        manager.sendToWs(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
                a: updatedAsks.length ? updatedAsks : [[price, "0"]],
                b: updatedBids.length ? updatedBids : [[price, "0"]],
                e: "depth"
            }
        });
    }
    publisWsDepthUpdates(fills, price, side, market) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) {
            return;
        }
        const depth = orderbook.getDepth();
        if (side === "buy") {
            const updatedAsks = depth === null || depth === void 0 ? void 0 : depth.asks.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatedBid = depth === null || depth === void 0 ? void 0 : depth.bids.find(x => x[0] === price);
            console.log("publish ws depth updates");
            manager.sendToWs(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatedAsks,
                    b: updatedBid ? [updatedBid] : [],
                    e: "depth"
                }
            });
            const data = {
                type: "depth",
                stream: `depth@${market}`,
                data: {
                    a: updatedAsks,
                    b: updatedBid ? [updatedBid] : [],
                    e: "depth"
                }
            };
            //  ws.send(JSON.stringify(data));
        }
        if (side === "sell") {
            const updatedBids = depth === null || depth === void 0 ? void 0 : depth.bids.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatedAsk = depth === null || depth === void 0 ? void 0 : depth.asks.find(x => x[0] === price);
            console.log("publish ws depth updates");
            manager.sendToWs(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatedAsk ? [updatedAsk] : [],
                    b: updatedBids,
                    e: "depth"
                }
            });
        }
    }
    updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty) {
        if (side === "buy") {
            fills.forEach(fill => {
                var _a, _b, _c, _d;
                // Update quote asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = ((_a = this.balances.get(fill.otherUserId)) === null || _a === void 0 ? void 0 : _a[quoteAsset].available) + (fill.qty * fill.price);
                //@ts-ignore
                this.balances.get(userId)[quoteAsset].locked = ((_b = this.balances.get(userId)) === null || _b === void 0 ? void 0 : _b[quoteAsset].locked) - (fill.qty * fill.price);
                // Update base asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = ((_c = this.balances.get(fill.otherUserId)) === null || _c === void 0 ? void 0 : _c[baseAsset].locked) - fill.qty;
                //@ts-ignore
                this.balances.get(userId)[baseAsset].available = ((_d = this.balances.get(userId)) === null || _d === void 0 ? void 0 : _d[baseAsset].available) + fill.qty;
            });
        }
        else {
            fills.forEach(fill => {
                var _a, _b, _c, _d;
                // Update quote asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].locked = ((_a = this.balances.get(fill.otherUserId)) === null || _a === void 0 ? void 0 : _a[quoteAsset].locked) - (fill.qty * fill.price);
                //@ts-ignore
                this.balances.get(userId)[quoteAsset].available = ((_b = this.balances.get(userId)) === null || _b === void 0 ? void 0 : _b[quoteAsset].available) + (fill.qty * fill.price);
                // Update base asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].available = ((_c = this.balances.get(fill.otherUserId)) === null || _c === void 0 ? void 0 : _c[baseAsset].available) + fill.qty;
                //@ts-ignore
                this.balances.get(userId)[baseAsset].locked = ((_d = this.balances.get(userId)) === null || _d === void 0 ? void 0 : _d[baseAsset].locked) - (fill.qty);
            });
        }
    }
    checkAndLockFunds(baseAsset, quoteAsset, side, userId, asset, price, quantity) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (side === "buy") {
            if ((((_b = (_a = this.balances.get(userId)) === null || _a === void 0 ? void 0 : _a[quoteAsset]) === null || _b === void 0 ? void 0 : _b.available) || 0) < Number(quantity) * Number(price)) {
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[quoteAsset].available = ((_c = this.balances.get(userId)) === null || _c === void 0 ? void 0 : _c[quoteAsset].available) - (Number(quantity) * Number(price));
            //@ts-ignore
            this.balances.get(userId)[quoteAsset].locked = ((_d = this.balances.get(userId)) === null || _d === void 0 ? void 0 : _d[quoteAsset].locked) + (Number(quantity) * Number(price));
        }
        else {
            if ((((_f = (_e = this.balances.get(userId)) === null || _e === void 0 ? void 0 : _e[baseAsset]) === null || _f === void 0 ? void 0 : _f.available) || 0) < Number(quantity)) {
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[baseAsset].available = ((_g = this.balances.get(userId)) === null || _g === void 0 ? void 0 : _g[baseAsset].available) - (Number(quantity));
            //@ts-ignore
            this.balances.get(userId)[baseAsset].locked = ((_h = this.balances.get(userId)) === null || _h === void 0 ? void 0 : _h[baseAsset].locked) + Number(quantity);
        }
    }
    onRamp(userId, amount) {
        const userBalance = this.balances.get(userId);
        if (!userBalance) {
            this.balances.set(userId, {
                [exports.BASE_CURRENCY]: {
                    available: amount,
                    locked: 0
                }
            });
        }
        else {
            userBalance[exports.BASE_CURRENCY].available += amount;
        }
    }
    setBaseBalances() {
        this.balances.set("1", {
            [exports.BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
        this.balances.set("2", {
            [exports.BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
        this.balances.set("5", {
            [exports.BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
    }
    getOrderBook() {
        return this.orderbooks;
    }
}
exports.Engine = Engine;
