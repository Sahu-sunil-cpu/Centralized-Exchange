
//write types for incoming and outgoing message
export const BASE_URL = "ws://localhost:8080"

export class WsManager {
    private ws: WebSocket;
    private static instance: WsManager;
    private bufferedMessages: any[] = [];
    private callbacks: any = {};
    private id: number;
    private initialized: boolean = false;
    private type: string;
    private data: any;

    private constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new WsManager();
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }
        this.ws.onmessage = (event) => {
            console.log("dgfgfgf", event)
            const { stream, data } = JSON.parse(event.data);

            const type = stream.split("@")[0];

            this.type = type;
            this.data = data;

            if (this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker = {
                            lastPrice: data.c,
                            high: data.h,
                            low: data.l,
                            volume: data.v,
                            quoteVolume: data.V,
                            symbol: data.s,
                        }
                        console.log(newTicker);
                        callback(newTicker);
                    }

                    if (type === "depth") {

                        const updatedBids = data.b;
                        const updatedAsks = data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }

                    if(type === "trade") {
                        // match check 
                        const newTicker = {
                            tradeId: data.t,
                            matched: data.m,
                            price: data.p,
                            quantity: data.q,
                            symbol: data.s,
                            side: data.n,
                            time: new Date().getTime()
                        }
                        console.log(newTicker);
                        console.log(newTicker.time)
                        callback(newTicker);
                    }
                });
            }
        }
    }

    getTicker() {
        const data = this.data
        if (this.type === "ticker") {
            const newTicker = {
                lastPrice: data.c,
                high: data.h,
                low: data.l,
                volume: data.v,
                quoteVolume: data.V,
                symbol: data.s,
            }
            console.log(newTicker);

            return newTicker;
        }

        console.log("no ticker data found");
    }


    getDepth() {
        const data = this.data;

        console.log(this.type)
        if (this.type === "depth") {

            const newDepth = {
                bids: data.b,
                asks: data.a,
            }

            console.log(newDepth);
            return newDepth;
        }

        console.log("no ticker data found");
    }

    sendMessage(message: any) {
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type: string, callback: any, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
        // "ticker" => callback
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}