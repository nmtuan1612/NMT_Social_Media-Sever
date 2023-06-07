import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    author_ids: { type: [String], required: true },
    updated_time: { type: String },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("Conversations", conversationSchema);
export default conversationModel;
