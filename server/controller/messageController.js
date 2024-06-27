const Message = require("../models/Message.js");
const Chat = require("../models/Chat.js");
const User = require("../models/User.js");
const { default: mongoose } = require("mongoose");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = (async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: new mongoose.Types.ObjectId(chatId),
    };
  
    try {
      let message = await Message.create(newMessage);
  
      const sender = await User.findById(message.sender, "name avatar email")
      const chat = await Chat.findById(message.chat.toString());

      message = {
        ...message.toObject(),
        sender,
        chat
      };
      // Manually populate chat users
      const chatUsers = await User.find({ _id: { $in: chat.users } }, "name avatar email");
      message.chat.users = chatUsers;
  
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  
  module.exports = { allMessages, sendMessage };