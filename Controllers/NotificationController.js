import NotiModel from "../Models/notificationModel.js";

export const createNotification = async (req, res) => {
  const newNotification = new NotiModel(req.body);

  try {
    const notification = await newNotification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = async (req, res) => {
  const notiData = req.body;

  try {
    await NotiModel.deleteMany(notiData);

    res.status(200).json("Notification deleted!");
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async (req, res) => {
  const userId = req.params.id;

  try {
    const notifications = await NotiModel.find({ userReceiveId: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
};
