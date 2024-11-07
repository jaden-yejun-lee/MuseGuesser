const mongoose = require("mongoose");

// WE DONT USE THIS YET (GOTTA FIGURE OUT DB CONFIG)
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  duration: { type: Number },
  preview_url: { type: String },
});

module.exports = mongoose.model("Song", songSchema);
