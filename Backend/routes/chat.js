const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/authMiddleware");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/userChat");

//============== access Chat router -======================//

router.route("/chat").post(isAuth, accessChat);
router.route("/").get(isAuth, fetchChat);
router.route("/group").post(isAuth, createGroupChat);
router.route("/renameGroup").put(isAuth, renameGroup);
router.route("/removeFromGroup").put(isAuth, removeFromGroup);
router.route("/groupAdd").put(isAuth, addToGroup);

module.exports = router;
