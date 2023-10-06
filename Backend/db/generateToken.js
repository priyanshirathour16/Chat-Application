const jwt = require("jsonwebtoken");
const scret_Key = process.env.scret_Key;

const generateToken = (id) => {
  const token = jwt.sign({ id }, scret_Key, {
    expiresIn: "30d",
  });
  return token;
};

module.exports = generateToken;
