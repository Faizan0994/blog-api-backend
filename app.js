const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 3000, (error) => {
  console.log("server listening...");
  if (error) {
    console.log(error);
  }
});
