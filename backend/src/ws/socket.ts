import { WebSocketServer,WebSocket } from "ws";
import http from "http";
import type { Room } from "../types/room.js";
import { broadcast } from "../utils/broadCast.js";
//import { rooms } from "../utils/state.js";

const rooms:Room = {};
console.log("📦 socket.ts loaded");

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({server});

  console.log("🧩 WebSocketServer initialized");
  wss.on("connection", function connection(ws) {
    console.log("🟢 New WebSocket connection established");
    let currentRoomId :string | null = null;
    let currentUserName:string |null = null;
    
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      //console.log("received: %s", data);
      console.log("📩 Raw message received:", data.toString());
      let parsedData ;
      try {
        parsedData = JSON.parse(data.toString());  
        console.log("📦 Parsed message:", parsedData);
      } catch (error) {
        console.log(error)
      }
      if(parsedData.type=="JOIN_ROOM"){
        // if (currentRoomId) {
        //   console.log("⚠️ Duplicate JOIN ignored");
        //   return;
        // }
        const {userName,roomId} = parsedData;
        console.log(`👤 User "${userName}" is joining room "${roomId}"`);
        currentRoomId = roomId;
        currentUserName = userName;
        if(!rooms[roomId]){
          console.log("🧠 Current rooms object:", Object.keys(rooms));
          console.log(`🆕 Room "${roomId}" created`);
          rooms[roomId] = {clients:new Set(),code:"",question:null,users:new Map()}
        }
        rooms[roomId].clients.add(ws);
        rooms[roomId].users.set(ws,userName);
        console.log(
          `👥 Room "${roomId}" clients count:`,
          rooms[roomId].clients.size
        );
        ws.send(
          JSON.stringify({
            type:"CODE_UPDATE",
            code:rooms[roomId].code,
          })
        );
        console.log(`📤 Sent CODE_UPDATE to "${userName}"`);
        ws.send(
          JSON.stringify({
            type: "USER_LIST",
            users: Array.from(rooms[roomId].users.values()),
          })
        );
        broadcast(
          roomId,{
            type:"USER_JOINED",
            userName:currentUserName,
          },
          rooms,
          ws
        )
        if(rooms[roomId].question){
          ws.send(
            JSON.stringify({
              type:"QUESTION_UPDATE",
              question:rooms[roomId].question
            })
          )
        }

      } else if(parsedData.type =="CODE_CHANGE"){
        const {codeChange} = parsedData;
        if(currentRoomId && rooms[currentRoomId]){
          rooms[currentRoomId]!.code = codeChange;
          broadcast(
            currentRoomId,
            {
              type:"CODE_UPDATE",
              code:codeChange,
              userName:currentUserName
            },
            rooms,
            ws
          )
        }
      } else if(parsedData.type === "LEAVE_ROOM" && currentRoomId){
        leaveRoom(ws,currentRoomId,currentUserName);
        currentRoomId=null;
      } else if(parsedData.type === "SET_QUESTION"){
        const {question} = parsedData;
        if(currentRoomId && rooms[currentRoomId]){
          rooms[currentRoomId]!.question = question;
          broadcast(
            currentRoomId,
            {
              type:"QUESTION_UPDATE",
              question,
              userName:currentUserName
            },
            rooms
          )
        }
      }
    });
      ws.on("close",()=>{
        if(currentRoomId){
          leaveRoom(ws,currentRoomId,currentUserName);
        }
      })

    });

  //  ws.send("something");
  }


function leaveRoom(ws:WebSocket,roomId:string,userName:string| null){
  if(!rooms[roomId]) return;
  rooms[roomId].clients.delete(ws);
  rooms[roomId].users.delete(ws);
  broadcast(
    roomId,
    {
      type: "USER_LIST",
      users: Array.from(rooms[roomId].users.values()),
    },
    rooms
  );

  broadcast(
    roomId,
    {
      type:"USER_LEFT",
      userName,
    },
    rooms,
    ws
  );

  if(rooms[roomId].clients.size ==0){
    delete rooms[roomId]
  }
}