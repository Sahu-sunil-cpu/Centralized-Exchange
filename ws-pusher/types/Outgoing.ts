
export type TickerUpdateMessage = {
    type: "trade",
    data: {
        o?: string,
        h?: string,
        l?: string,
        v?: string,
        c?: string,
        ts?: string,
        b?: bucket
        id?: number,
        m?: string
    }
} 

type bucket = "1m" | "5m" | "1h";

export type OutgoingMessage = TickerUpdateMessage