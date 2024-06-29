const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*:*" /* @dev First, read about security */,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days,
    "Access-Control-Allow-Credentials": true,
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (["GET", "POST"].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
    res.end("Hello World");
    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});
const io = new Server(3000, {
  cors: { origin: ["https://admin.socket.io"], credentials: true },
  transports: ["websocket", "polling"],
});

instrument(io, {
  auth: false,
  mode: "development",
});

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

// server.listen(3000, () => {
//   console.log("server running at http://localhost:3000");
// });
