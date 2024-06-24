const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      trim: true, 
      required: true 
    },
    isGroupChat: { 
      type: Boolean, 
      default: false 
    },
    users: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
  },
  { 
    timestamps: true 
  }
);

// Instance method to add a user to the chat
chatSchema.methods.addUser = function(userId) {
  if (!this.users.includes(userId)) {
    this.users.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove a user from the chat
chatSchema.methods.removeUser = function(userId) {
  this.users = this.users.filter(user => !user.equals(userId));
  return this.save();
};

// Static method to find group chats
chatSchema.statics.findGroupChats = function() {
  return this.find({ isGroupChat: true });
};

// Static method to find user chats
chatSchema.statics.findUserChats = function(userId) {
  return this.find({ users: userId });
};

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
