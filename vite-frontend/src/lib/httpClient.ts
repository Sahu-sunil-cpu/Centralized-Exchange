
import axios from "axios"
import { BASE_URL } from "./utils"
import { Depth, Ticker, Trade } from "./types";
import { machine } from "os";


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



function generateOrders(count = 100) {
    const orders = [];
  
    for (let i = 0; i < count; i++) {
      const price = (30 + Math.random() * 10).toFixed(2); // price between 30 and 40
      const quantity = Math.floor(10 + Math.random() * 90); // quantity between 10 and 100
      const side = Math.random() < 0.5 ? "buy" : "sell";
     // const userId = String(Math.floor(1 + Math.random() * 10)); // userId between 1 and 10
  
      orders.push({
        data: {
          market: "TATA_INR",
          price,
          quantity: String(quantity),
          side,
          userId: 1
        }
      });
    }
  
    return orders;
  }
  
  const mockOrders = generateOrders();
  console.log(mockOrders);

  export function* placeOrder(mockOrders) {
    for(let order of mockOrders) {
        yield order;
    }

    return null
  }

  export const orderData = placeOrder(mockOrders);



  