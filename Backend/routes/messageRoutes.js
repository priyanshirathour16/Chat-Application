const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controller/chatMessages");

router.route("/").post(isAuth, sendMessage);
router.route("/:chatId").get(isAuth, allMessages);

module.exports = router;
