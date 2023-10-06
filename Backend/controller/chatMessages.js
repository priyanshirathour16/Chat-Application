const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name  img");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name img email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }
};

const allMessages = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name img email")
      .populate("chat");

    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }
};

module.exports = { sendMessage, allMessages };
