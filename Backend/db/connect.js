const mongoose = require("mongoose");
const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => console.log("Db connected"))
  .catch((err) => console.log("failed to connected", err));
