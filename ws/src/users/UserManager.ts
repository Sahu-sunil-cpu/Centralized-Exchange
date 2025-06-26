import { WebSocket } from "ws";
import { WsType } from "../types/OutgoingMessage";
// import { Fill } from "../src/engine/orderbook";

interface User {
   userId: string,
   tickerId: string,
   socket: WebSocket
}


interface Room {
   users: User[],
}

export class UserManager {
   //   private balances: Map<string, UserBalance>;
   private rooms: Map<string, Room>;
   private count: number;


   constructor() {
      this.rooms = new Map<string, Room>();
      this.count = 0;
      //     this.balances = new Map<string, UserBalance>();
   }


   addUser(tickerId: string, ws: WebSocket) {
    
       const users = this.rooms.get(tickerId);
       if (!users) {
         this.rooms.set(tickerId, {
            users: []
         })
      }

      const userExist = users?.users.find(({socket}) => socket == ws);
      console.log(userExist)

      if(userExist) {
         console.log(`----------user id ${userExist.userId} already exist---------`);
         return;
      }
      const userId = this.getId().toString();
      this.rooms.get(tickerId)?.users.push({
         userId,
         tickerId,
         socket: ws
      })

      ws.on('close', (reasonCode, description) => {
         this.removeUser(tickerId, userId);
         console.log(`user of ${userId} left ${tickerId}`);
      })

      console.log(this.rooms.get(tickerId)?.users)

      return userId;
   }

   removeUser(tickerId: string, id: string) {

      const users = this.rooms.get(tickerId)?.users;

      if (users) {
         users.filter(({ userId }) => userId !== id);
      }
   }


   getUser(tickerId: string, id: string) {
      const user = this.rooms.get(tickerId)?.users.find(({ userId }) => id === userId);

      return user ?? null;
   }


   private getId() {
      return this.count++;
   }

   public emit(message: WsType, ws: WebSocket) {
      const stream = message.stream;
      const ticker = stream.split("@");

      const data = message.data;
      const users = this.rooms.get(`@${ticker[1]}`)?.users;

      if (!users) {
         console.log(`users of @${ticker[1]} is not found`);
         return;
      }


      users.forEach(({ socket }) => {

         console.log(JSON.stringify(data));

         socket.send(JSON.stringify(message))
      })

   }

}