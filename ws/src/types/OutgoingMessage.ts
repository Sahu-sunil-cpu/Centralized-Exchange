


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