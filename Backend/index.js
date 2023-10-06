require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8800;
const cors = require("cors");
const router = require("./routes/route");
const chatRouter = require("./routes/chat");
const messageRoute = require("./routes/messageRoutes");
const User = require("./models/userModel");
require("./db/connect");
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin , X-Requested-With , Content-Type , Accept"
//   );
//   next();
// });

// app.get("/", (req, res) => {
//   res.send("working fine");
// });

app.use(cors());
app.use(router);
app.use("/user", chatRouter);
app.use("/chat", messageRoute);

const server = app.listen(port, () => {
  console.log("server runnnig successfully");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUser = [];

io.on("connection", async (socket) => {
  console.log("connected to socket.io");
  // console.log(socket.handshake.auth.token);
  socket.on("new-user-connected", (newUserId) => {
    if (!onlineUser.some((user) => user._id === newUserId)) {
      onlineUser.push({ _id: newUserId, socketId: socket.id });
      console.log(" new user online", onlineUser);
    }
    io.emit("get-user", onlineUser);
  });
  socket.on("offline", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    console.log("after offline user", onlineUser);
    io.emit("get-user", onlineUser);
  });

  socket.on("setup", async (userData) => {
    socket.join(userData._id);

    // console.log("this is our user id---------------------- ", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joining room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat user is not defiend");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

  socket.on("disconnect", async () => {
    console.log("disconnect");
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    console.log(" user Disconnected", onlineUser);
    io.emit("get-user", onlineUser);
  });
});
