const mongoose = require("mongoose");

// Class for songs consisting of title, artist, album, duration, and preview_url
const songSchema = new mongoose.Schema({
  // title of song
  title: { type: String, required: true },
  // artist of song
  artist: { type: String, required: true },
  // song's album (if it exists)
  album: { type: String },
  // duration of song
  duration: { type: Number },
  // url for a short 30-second snippet of playable song
  preview_url: { type: String },
});

module.exports = mongoose.model("Song", songSchema);
