import express from "express";
import {
  createConversation,
  createMessage,
  getAllConversationsOfUser,
  getAllMessageOfChat,
} from "../Controllers/ConversationController.js";

const router = express.Router();

router.get("/:id", getAllConversationsOfUser);
router.post("/", createConversation);
router.post("/message", createMessage);
router.get("/message/:id", getAllMessageOfChat);

export default router;
