const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routers/adminRouter");
const userRouter = require("./routers/userRouter");

const app = express();

require('dotenv').config

//port setting


// view engine setup
app.set("view engine", "ejs");
app.set("views", "./views/user");
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
   mongoose.connect(DB, () => {
    console.log("database connected");
  });
};
conn().then(
  app.listen(8000, () => {
    console.log("server started on port " + 8000);
  }) 
).catch((err)=>console.log(err))

// error page 

// handling 404 page

app.get('*',(req,res)=>{
  res.render('404')
})

app.use('/',(err,req,res,next)=>{
  res.render('error')
})


// handle other error

