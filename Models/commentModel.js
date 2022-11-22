import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    postId: { type: String, required: true },
    userId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [],
  }, { timestamps: true }
);

const CommentModel = mongoose.model("Comments", commentSchema);

export default CommentModel;
