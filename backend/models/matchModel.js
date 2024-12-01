const mongoose = require("mongoose");

// Match Schema
const matchSchema = new mongoose.Schema({
    // game type: "Daily Challenge" or "Room" or "Single"
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

// Save game records
matchSchema.methods.saveGameRecords = async function (players) {
    const playerRecords = players.map((player) => ({
        username: player.id,
        score: player.score
    }));

    this.players = playerRecords;
    this.date = Date.now()
    this.gameType = "Room"

    return await this.save();
}

module.exports = mongoose.model("Match", matchSchema);