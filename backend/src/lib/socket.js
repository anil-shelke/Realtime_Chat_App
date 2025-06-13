// import { Server}  from "socket.io"
// import http from "http"
// import express from "express"

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:5173"],
//     },
// });

// // used to store online users
// const userSocketMap = {};   // {userId: socketId}

// export function getReceiverSocketId(userId) {
//     return userSocketMap[userId]
// }


// io.on("connection", (socket) => {
//     console.log("A user connected", socket.id)

//     const userId = socket.handshake.query.userId
//     if(userId) userSocketMap[userId] = socket.id

//     // io.emit() is used to send events to all the connected clients
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//         console.log("A user disconnected", socket.id);
//         delete userSocketMap[userId];
//         io.emit("getOnlineUsers",Object.keys(userSocketMap));
//     })
// })


// export {io, app, server}





import { Server } from "socket.io";

let io;
const userSocketMap = {}; // ✅ moved to global scope

function setupSocket(serverInstance) {
  io = new Server(serverInstance, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { setupSocket, io, getReceiverSocketId };
