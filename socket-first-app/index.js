const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile("index");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("chat message", (msg) => {
    // console.log("server message: " + msg); 
    io.emit("chat message", msg);
    socket.broadcast.emit("hi", msg);
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
  });

  // console.log(io.engine.clientsCount);
  // console.log(io.of("/").sockets.size);

  socket.on("onRoom", (roomName, roomChat) => {
    io.to(roomName).emit("foo", roomChat);
  });

  // socket.on("ping", (count) => {
  //   console.log(count);
  // });

  // socket.onAny((eventName, arg) => {
  //   console.log(eventName, " : ", arg);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
