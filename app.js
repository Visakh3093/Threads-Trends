const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routers/adminRouter");
const userRouter = require("./routers/userRouter");
// const cookieParser = require('cookie-parser')

const app = express();

require('dotenv').config

//port setting
const PORT = process.env.PORT || 7000;

// view engine setup
app.set("view engine", "ejs");
userRouter.set("views", "./views/user");
adminRouter.set("views", "./views/admin");

// router setup
app.use("/", userRouter);
app.use("/admin", adminRouter);

// url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// css,image path setting
app.use("/", express.static("public"));
userRouter.use(express.static("./public/asset"));
adminRouter.use(express.static("./public/admin"));

// mongo db connection

const DB = process.env.mongodb
mongoose.set("strictQuery", true);
const conn = async () => {
  await mongoose.connect(DB, () => {
    console.log("database connected");
  });
};
conn().then(
  app.listen(PORT, () => {
    console.log("server started on port " + PORT);
  })
);
