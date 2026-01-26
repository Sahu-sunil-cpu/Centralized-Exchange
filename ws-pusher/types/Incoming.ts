export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";
export const TIMEFRAME = "TIMEFRAME";

export type SubscribeMessage = {
    method: typeof SUBSCRIBE,
    params: string[]
}

export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE,
    params: string[]
}

export type TradeTime = {
    method: typeof TIMEFRAME,
    params: string
}

export type IncomingMessage = SubscribeMessage | UnsubscribeMessage | TradeTime;