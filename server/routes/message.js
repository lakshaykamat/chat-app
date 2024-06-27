const express = require("express");  
const { sendMessage, allMessages } = require("../controller/messageController");

const router = express.Router();

router.post("/", sendMessage);
router.get("/:chatId", allMessages);

module.exports = router;
