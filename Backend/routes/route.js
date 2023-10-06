const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const generateToken = require("../db/generateToken");
const bcrypt = require("bcryptjs");
const isAuth = require("../middleware/authMiddleware");

//====================== for signup ===========================//
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, img } = req.body;
    console.log(name);
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("please enter all the feilds");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false });
      throw new Error("User already exists");
    }
    const generateSalt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(password, generateSalt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: secPassword,
      img: img,
    });
    console.log(newUser);
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        img: newUser.img,
        token: generateToken(newUser._id),
        success: true,
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  } catch (err) {
    console.log(err);
  }
});

//======================== for Login ========================//

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).redirect("back");
      throw new Error("Please enterr all the feild");
    } else {
      const newUser = await User.findOne({ email });

      const secPassword = await bcrypt.compare(password, newUser.password);

      if (newUser && secPassword) {
        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          img: newUser.img,
          token: generateToken(newUser._id),
          success: true,
        });
      }
    }
  } catch (err) {
    res.status(400).redirect("back");
  }
});

router.get("/search", isAuth, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

router.get("/userData/:id", async (req, res) => {
  const { id } = req.params;
  const userData = await User.findById(id);
  res.json(userData);
});

module.exports = router;
