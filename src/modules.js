import post from "./models/post.js";
import user from "./models/user.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";

const registerHandler = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const final = newPath.slice(4);
  const pass = await bcrypt.hash(req.body.password, 10);
  const { name, location, occupation, email } = req.body;

  const newUser = new user({
    name,
    location,
    occupation,
    email,
    image: final,
    password: pass,
  });

  const result = await newUser.save();
  res.json(result);
};

const loginHandler = async (req, res) => {
  const theUser = await user.findOne({ email: req.body.email });
  const result = await bcrypt.compare(req.body.password, theUser.password);
  if (!result) res.json("Invalid Credentials!");
  await theUser.populate("friends");
  const token = jsonwebtoken.sign({ user: result }, "secret");
  res.json([theUser, token]);
};

const homepageHandler = async (req, res) => {
  const posts = await post.find().populate("creator");

  res.json(posts);
};

const newPostHandler = async (req, res) => {
  const { originalname, path } = req.file;

  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const final = newPath.slice(4);
  const newPost = new post({
    caption: req.body.caption,
    creator: req.body.creator,
    image: final,
  });
  const result = await newPost.save();
  res.json(result);
};

const friendHandler = async (req, res) => {
  if (req.body.id1 == req.body.id2) {
    const user1 = await user.findById(req.body.id1);
    await user1.populate("friends");
    return res.json(user1);
  }
  const user1 = await user.findById(req.body.id1);
  const user2 = await user.findById(req.body.id2);

  if (user1.friends.includes(user2._id)) {
    user1.friends = user1.friends.filter(
      (fr) => fr.toString() !== user2._id.toString()
    );
    user2.friends = user2.friends.filter(
      (fr) => fr.toString() !== user1._id.toString()
    );

    await user1.save();
    await user2.save();
    await user1.populate("friends");
    await user2.populate("friends");
    return res.json(user1);
  }

  user1.friends.push(user2);
  user2.friends.push(user1);
  await user1.save();
  await user2.save();
  await user1.populate("friends");
  await user2.populate("friends");

  res.json(user1);
};

const userPostsHandler = async (req, res) => {
  const id = req.params.id;
  const result = await post.find({ creator: id }).populate("creator");
  res.json(result);
};

const userHandler = async (req, res) => {
  const id = req.params.id;
  const result = await user.find({ _id: id }).populate("friends");
  res.json(result);
};

const likeHandler = async (req, res) => {
  const user = req.body.id;
  let result = await post.findById(req.params.id);
  if (result.likes.includes(user)) {
    result.likes = result.likes.filter((fr) => fr != user);
  } else result.likes.push(user);
  await result.save();
  await result.populate("creator");

  res.json(result);
};

const commentHandler = async (req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;
  const result = await post.findById(id);
  result.comments.push(comment);
  await result.save();
  await result.populate("creator");

  res.json(result);
};

const postByIdHandler = async (req, res) => {
  res.json(await post.findById(req.params.id));
};

export {
  friendHandler,
  registerHandler,
  loginHandler,
  homepageHandler,
  newPostHandler,
  userPostsHandler,
  userHandler,
  likeHandler,
  commentHandler,
  postByIdHandler,
};
