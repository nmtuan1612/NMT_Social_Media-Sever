import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    chatID: { type: String, required: true },
    author: { type: String, required: true },
    author_id: { type: String, required: true },
    message: { type: String, required: true },
    created_time: { type: String, required: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Messages", messageSchema);
export default MessageModel;
