import {
  registerHandler,
  loginHandler,
  homepageHandler,
  newPostHandler,
  friendHandler,
  userPostsHandler,
  userHandler,
  likeHandler,
  commentHandler,
  postByIdHandler,
} from "./modules.js";
import express from "express";
import jsonwebtoken from "jsonwebtoken";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
import cors from "cors";
app.use(cors());

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";
dotenv.config();
const mongo_url = process.env.mongo_url;

app.use("/uploads", express.static(__dirname + "/uploads"));

import mongoose from "mongoose";
const fun = async () => {
  const res = await mongoose.connect(mongo_url);
  console.log(res);
};
fun();

const auth = async (req, res, next) => {
  const result = jsonwebtoken.verify(req.headers.token, "secret");
  next();
};

import multer from "multer";

const upload = multer({ dest: "./src/uploads/" });

app.get("/homepage", homepageHandler);

app.post("/register", upload.single("image"), registerHandler);
app.post("/login", loginHandler);
app.post("/newpost", auth, upload.single("file"), newPostHandler);
app.post("/befriend", friendHandler);
app.get("/posts/:id", userPostsHandler);
app.get("/user/:id", userHandler);
app.patch("/post/:id/like", likeHandler);
app.patch("/post/:id/comment", commentHandler);
app.get("/post/:id", postByIdHandler);
app.get("/dir", (req, res) => {
  res.json({ dir: __dirname + "/uploads" });
});

app.listen("5000");

console.log();
