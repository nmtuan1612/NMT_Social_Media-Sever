import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/UploadRoute.js";
import CommentRoute from "./Routes/CommentRoute.js";
import NotificationRoute from "./Routes/NotificationRoute.js";
import ConversationRoute from "./Routes/ConversationRoute.js";
// import { connectToDB } from "./config/database.js";
import MessageModel from "./Models/messageModel.js";

// Routes
const app = express();

// Serve images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();

// connectToDB();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .then(() =>
  //   app.listen(process.env.PORT, () =>
  //     console.log(`Listening at port ${process.env.PORT}`)
  //   )
  // )
  .catch((error) => console.log(error));

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
app.use("/comment", CommentRoute);
app.use("/notify", NotificationRoute);
app.use("/conversation", ConversationRoute);

// Socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://nmtmedia.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_chat", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    const newMessage = new MessageModel(data);
    newMessage.save((err) => {
      if (err) {
        console.log("Error saving message:", err);
      } else {
        console.log("Message saved:");
      }
    });
    socket.to(data.chatID).emit("receive_message", data);
  });

  // Handle the 'disconnect' event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Listening at port ${process.env.PORT}`)
);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
