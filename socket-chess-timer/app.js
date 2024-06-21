const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("socket id:", socket.id);

  socket.on("startB", () => {
    socket.broadcast.emit("startBlack");
  });

  socket.on("startW", () => {
    socket.broadcast.emit("startWhite");
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "is disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
