
// export interface KLine {
//     close: string;
//     end: string;
//     high: string;
//     low: string;
//     open: string;
//     quoteVolume: string;
//     start: string;
//     trades: string;
//     volume: string;
// }

export interface Trade {
    "id": number,
    "isBuyerMaker": boolean,
    "price": string,
    "quantity": string,
    "quoteQuantity": string,
    "timestamp": number
}

export interface Depth {
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: string
}

export interface Ticker {
    "firstPrice": string,
    "high": string,
    "lastPrice": string,
    "low": string,
    "priceChange": string,
    "priceChangePercent": string,
    "quoteVolume": string,
    "symbol": string,
    "trades": string,
    "volume": string
}


export interface klineType{
    time: number;
    open: number;
    high: number;
    low:  number
    close: number
    volume: number
}


export interface ChartProps {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
    width: number;
    height: number;
}