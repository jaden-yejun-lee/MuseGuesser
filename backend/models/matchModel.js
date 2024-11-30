const mongoose = require("mongoose");

// Match Schema
const matchSchema = new mongoose.Schema({
    // game type: "daily" or "room" or "single"
    gameType: String,
    // date when game ended
    date: Date,
    // player: username - score tuples
    // this will only be > 1 for room games
    players: [{
        username: String,
        score: Number
    }]

});


module.exports = mongoose.model("Match", matchSchema);