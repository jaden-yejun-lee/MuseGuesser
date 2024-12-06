const mongoose = require("mongoose");

// Daily Challenge class has a date and an array for questions
const dailyChallengeSchema = new mongoose.Schema({
  // One challenge per day
  date: { type: Date, required: true, unique: true },
  questions: {
    type: Array,
    default: [], // Array of track data (4 options and correct answer)
  },
});

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);
