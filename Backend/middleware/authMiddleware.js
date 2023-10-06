const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const isAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
    // && req.headers.authorization.startWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decode tokrn id -----------
      const decoded = jwt.verify(token, process.env.scret_Key);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error(err);
      res.status(401);
      throw new Error("user not Authenticated");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("user not Authenticated , no token ");
  }
};

module.exports = isAuth;
