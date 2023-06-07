import conversationModel from "../Models/conversationModel.js";
import MessageModel from "../Models/messageModel.js";

export const createConversation = async (req, res) => {
  try {
    const oldConversation = await conversationModel.find({
      author_ids: req.body.author_ids,
    });
    if (oldConversation.length) {
      res.status(200).json(oldConversation[0]);
    } else {
      const newConversation = new conversationModel(req.body);

      const conversation = await newConversation.save();
      res.status(200).json(conversation);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllConversationsOfUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const conversations = await conversationModel
      .find({ author_ids: userId })
      .sort({
        updatedAt: -1,
      });
    const conversationList = [];
    for (const conversation of conversations) {
      // Find the latest message for the conversation
      const newestMessage = await MessageModel.findOne({
        chatID: conversation._id,
      }).sort({ created_time: -1 });

      // Add the latest message as a field to the conversation
      if (newestMessage) {
        const conversationWithNewestMessage = {
          ...conversation._doc,
          newestMessage: newestMessage,
        };
        conversationList.push(conversationWithNewestMessage);
      }
    }
    res.status(200).json(conversationList);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createMessage = async (req, res) => {
  const newMessage = new MessageModel(req.body);
  try {
    const message = await newMessage.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllMessageOfChat = async (req, res) => {
  const chatID = req.params.id;

  try {
    const chatMessages = await MessageModel.find({ chatID }).sort({
      createdAt: 1,
    });
    res.status(200).json(chatMessages);
  } catch (error) {
    res.status(500).json(error);
  }
};
