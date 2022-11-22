import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    userCreateId: {
      type: String,
      required: true,
    },
    userCreateName: {
      type: String,
      required: true,
    },
    notiType: {
      type: String,
      required: true,
    },
    userReceiveId: {
      type: String,
      required: true,
    },
    postId: String,
    desc: String,
  },
  { timestamps: true }
);

const NotiModel = mongoose.model("Notifications", notificationSchema);

export default NotiModel;
