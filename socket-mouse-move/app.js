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

  socket.on("cordinate", ({ x, y }) => {
    socket.broadcast.emit("sendCordinateToEveryOne", { x, y });
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "is disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
