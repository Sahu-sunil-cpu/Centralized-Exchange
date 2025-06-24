import WebSocket, { WebSocketServer } from 'ws';
import { messageTypes } from './types/IncomingMessage';
import { UserManager } from './users/UserManager';
import { RedisManager } from './redis/RedisManager';


const wss = new WebSocketServer({ port: 8080 });
const manager = new UserManager();


wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  try {
    StartEngine(ws);
  } catch (e) {
    console.log(e);
  }

  ws.on('message', function message(data, isBinary) {
    //const creds = JSON.stringify(data);
    //console.log({ userData });

    try {
      const message = JSON.parse(data.toString());

      Handler(ws, message);
    } catch (e) {
      console.log(e);
    }

  

    // wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data, { binary: isBinary });
    //   }
    // });
  });
});



function Handler(ws: WebSocket, message: messageTypes) {
  const messageType = message.type;
  const payload = message.payload;

  // switch (messageType) {
  //   case "ADD_USER":
  //     // logic of if user exist 
  //     try {
  //       const userId = manager.addUser(payload.tickerId, ws);

  //     } catch (error) {
  //       console.error("error while adding user in ws");
  //     }
  // }

  if (messageType == "ADD_USER") {
    // logic of if user exist 
    try {
      const userId = manager.addUser(payload.tickerId, ws);

    } catch (error) {
      console.error("error while adding user in ws");
    }
  }else {
    console.log("no relevant message type found")
  }
}

async function StartEngine(ws: WebSocket) {

  try {
    const client = RedisManager.getInstance().getClient();
    console.log("ws client is running");

    while (true) {
      try {
        const response = await client.brPop("channel", 0);
        const element = response?.element as string;
        console.log(element)

        const message = JSON.parse(element);

        manager.emit(message, ws);


      } catch (error) {
        console.error("error while popping elements from queue");
      }
    }
  } catch (error) {
    console.error("error connecting to redis");

  }
}



