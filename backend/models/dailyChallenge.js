const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true }, // One challenge per day
  questions: {
    type: Array,
    default: [], // Array of track data (4 options and correct answer)
  },
});

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);
