var express = require("express");
var app = express();
var mongoose = require("mongoose");
var session = require("express-session");
var uuid = require("uuid/v4");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var UserModel = require("./userModel");
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true
  })
);
app.use(
  session({
    genid: uuid,
    secret: "secreeeet"
  })
);

function Authenticate(req, resp, next) {
  if (req.session.user && req.cookies["connect.sid"]) {
    next();
  } else {
    resp.json({ message: "authentication failed" });
  }
}
mongoose.connect("mongodb://localhost:27017/authenticationdb");

app.get("/", (req, resp) => {
  resp.send("is running.....");
});

app.post("/signup", async (req, resp) => {
  try {
    const { username, password, age } = req.body;
    let user = new UserModel({
      _id: mongoose.Types.ObjectId(),
      username,
      password,
      age
    });

    await user.save();
    resp.json({ message: "success" });
  } catch (err) {
    resp.json({ message: "error" });
  }
});

app.post("/signin", async (req, resp) => {
  try {
    const { username, password } = req.body;
    let user = await UserModel.findOne({ username, password });
    req.session.user = user;
    resp.json({ message: "success" });
  } catch (err) {
    resp.json({ message: "error" });
  }
});

app.get("/getuserdata", Authenticate, async (req, resp) => {
  try {
    let user = await UserModel.findOne({ _id: req.session.user._id });
    resp.json({ message: "success", user });
  } catch (err) {
    resp.json({ message: "error" });
  }
});

app.listen(8085);
