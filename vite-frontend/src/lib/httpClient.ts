
import axios from "axios"
import { BASE_URL } from "./utils"
import { Depth, Ticker, Trade } from "./types";


const getTickers = async (): Promise<Ticker[]> => {
    const response = await axios.get(`${BASE_URL}/ticker`);

    return response.data;
}

const getDepth = async (market: string): Promise<Depth> => {
    const response = await axios.get(`${BASE_URL}/depth/${market}`);
    return response.data;
}

const getTrades = async (market: string): Promise<Trade[]> => {
    const response = await axios.get(`${BASE_URL}/kline/${market}`);
    return response.data
}

