const { HttpStatusCode } = require("../lib/index.js");
const Chat = require("../models/Chat.js");
const User = require("../models/user.js");
const CustomError = require("../util/customError.js");

// Utility function to populate user data in chat
const populateChat = async (chat) => {
  return User.populate(chat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });
};

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST,"UserId parameter not sent with request")
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await populateChat(isChat);
    console.log(isChat);

    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      const chatData = {
        name: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(HttpStatusCode.OK).json(fullChat);
    }
  } catch (error) {
    next(error);
  }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res, next) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await populateChat(results);
    res.status(HttpStatusCode.OK).json(results);
  } catch (error) {
    next(error);
  }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res, next) => {
  const { users, name } = req.body;

  if (!users || !name) {
    throw new CustomError(HttpStatusCode.BAD_REQUEST,"Users and Group name not found")
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST,"More than 2 users are required to form a group chat")
  }

  parsedUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      name: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(HttpStatusCode.OK).json(fullGroupChat);
  } catch (error) {
    next(error);
  }
};

//@description     Rename Group
//@route           PUT /api/chat/rename
//@access          Protected
const renameGroup = async (req, res, next) => {
  const { chatId, name } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "Chat not found");
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};

//@description     Remove user from Group
//@route           PUT /api/chat/groupremove
//@access          Protected
const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(removed);
  } catch (error) {
    next(error);
  }
};

//@description     Add user to Group
//@route           PUT /api/chat/groupadd
//@access          Protected
const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  
  try {
    const user = await User.findById(userId)
    if(!user){
      throw new CustomError(HttpStatusCode.NOT_FOUND,"User not found")
    }
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "Chat not found");
    }

    res.status(200).json(added);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
