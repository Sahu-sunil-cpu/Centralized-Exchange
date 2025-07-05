"use client"
import { useEffect, useState } from "react";


export default function useSocket() {
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");
  
  ws.onopen = (message) => {
    console.log("connected");
    setSocket(ws);
  }
  
  ws.onmessage = (msg) => {
    console.log(msg.data);
  }
  
  return () => {
    socket?.close();
  }
    }, [])


    return socket;
  
}