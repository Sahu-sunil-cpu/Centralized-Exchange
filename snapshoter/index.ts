import express from "express"
import axios from "axios"

const app = express();

const order = [
    {
        market: "TATA_INR",
        price: Math.random()*100,
        quantity: Math.floor(Math.random()*100),
        side: "buy",
        userId: 1
    },
     {
        market: "TATA_INR",
        price: Math.random()*10,
        quantity: Math.floor(Math.random()*10),
        side: "sell",
        userId: 2
    },
     {
        market: "TATA_INR",
        price: Math.floor(Math.random()*100),
        quantity: Math.floor(Math.random()*1000),
        side: "buy",
        userId: 3
    },
     {
        market: "TATA_INR",
        price: Math.floor(Math.random()*100),
        quantity: Math.floor(Math.random()*100),
        side: "sell",
        userId: 4
    },
     {
        market: "TATA_INR",
        price: Math.floor(Math.random()*10),
        quantity: Math.floor(Math.random()*100),
        side: "buy",
        userId: 3
    },
    {
        market: "TATA_INR",
        price: Math.floor(Math.random()*1000),
        quantity: Math.floor(Math.random()*100),
        side: "sell",
        userId: 2
    },
];

async function placeOrder(index: number) {
    await axios.post("http://localhost:3001/api/v1/order", {
        type: "CREATE_ORDER",
        data: order[index]
    })
}

setInterval(() => {
    const index = Math.floor(Math.random()*10);
    if(index >= 0 && index <= order.length-1) {
        placeOrder(index);
        console.log(index);
    }
}, 100)