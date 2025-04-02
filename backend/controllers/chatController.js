const Chat = require("../models/Chat");

const getChatHistory = async (req, res) => {
  try {
    const { dealId } = req.params;
    const messages = await Chat.find({ dealId }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

const saveChat = async (req, res) => {
  try {
    const { dealId, senderId, text, type } = req.body;

    const newChat = new Chat({
      dealId,
      senderId,
      text,
      type,
    });

    await newChat.save();
    res.json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
};

const readChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const { messageId } = req.params;

    await Chat.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update read receipt" });
  }
};

module.exports = { getChatHistory, saveChat, readChat };
