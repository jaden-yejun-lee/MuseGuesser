const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    dailyScore: {
        type: Number,
        default: -1 // means not played yet
    },
    friends: {
        type: [String],
        default: []
    }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
  next();
});


module.exports = mongoose.model("User", userSchema);