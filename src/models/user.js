import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
  },
  occupation: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],
});

const user = new mongoose.model("user", userSchema);

export default user;
