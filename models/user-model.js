const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String },
  token: String,
  hash: String,
  salt: String,
  account: {
    username: { type: String, required: true },
    phone: { type: String },
  },
});
module.exports = User;
