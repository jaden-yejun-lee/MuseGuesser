const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Class for users with username, email, password, dailyScore, and friends
const userSchema = new mongoose.Schema({
    // username, email, password of user
    username: String,
    email: String,
    password: String,
    // each user's score for the dailyChallenge
    dailyScore: {
        type: Number,
        default: -1 // means not played yet
    },
    // user's friends
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