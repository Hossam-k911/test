var mongoose = require("mongoose");

var UserModel = new mongoose.model("Users", {
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  age: Number
});

module.exports = UserModel;
