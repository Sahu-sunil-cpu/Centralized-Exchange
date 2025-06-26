
import axios from "axios"
import { BASE_URL } from "./utils"
import { Depth, Ticker, Trade } from "./types";


export const getTickers = async (market: string): Promise<Ticker[]> => {
    const response = await axios.get(`${BASE_URL}/ticker`);

    return response.data;
}

export const getDepth = async (market: string): Promise<Depth> => {
    const response = await axios.get(`${BASE_URL}/depth/${market}`);
    return response.data;
}

export const getTrades = async (market: string): Promise<Trade[]> => {
    const response = await axios.get(`${BASE_URL}/kline/${market}`);
    return response.data
}

