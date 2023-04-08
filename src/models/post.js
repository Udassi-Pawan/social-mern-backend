import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
  creator: { type: mongoose.Types.ObjectId, ref: "user" },
  caption: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  image: String,
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
});

const post = new mongoose.model("post", postSchema);

export default post;
