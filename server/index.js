const env = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const authRouter = require("./routes/auth");
// const postRouter = require("./routes/post");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECT);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
// app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 1711;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
