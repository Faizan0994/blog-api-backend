const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.listen(process.env.PORT || 3000, (error) => {
  console.log("server listening...");
  if (error) {
    console.log(error);
  }
});
