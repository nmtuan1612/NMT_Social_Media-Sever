import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: new Date()
    // },
    desc: String,
    likes: [],
    comments: [],
    usersSaved: [],
    image: String,
    visibility: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Posts', postSchema);

export default PostModel;