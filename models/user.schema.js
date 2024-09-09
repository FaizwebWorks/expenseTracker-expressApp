const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Required"],
      minLength: [3, "Username must be at least 3 characters long"],
      unique: true,
    },
    password: String,
    email: {
      type: String,
      required: [true, "Email is Required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email Format",
      ],
    },
    avatar: {
      type: String,
      default: ""
  },
  },
  { timestamps: true }
);

// userSchema.plugin(plm, { usernameField: "email" }); // for email as username // createStrategy
userSchema.plugin(plm);

const UserSchema = mongoose.model("User", userSchema);

module.exports = UserSchema;
