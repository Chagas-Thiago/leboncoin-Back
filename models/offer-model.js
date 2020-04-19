const mongoose = require("mongoose");
const Offer = mongoose.model("Offer", {
  created: Date,
  //ligar com o offer route
  creator: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  description: String,
  picture: {},
  price: Number,
  title: String,
});
module.exports = Offer;
