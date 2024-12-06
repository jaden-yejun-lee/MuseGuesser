const mongoose = require("mongoose");

// Room class has an array for the players
const roomSchema = new mongoose.Schema({
    // array for players
    players: {
        type: Array,
        default: []     // { userId, score }
    }
});

// Save game records
roomSchema.methods.saveGameRecords = async function (players) {
    const playerRecords = players.map((player) => ({
        userId: player.id,
        score: player.score
    }));

    this.players = playerRecords;

    return await this.save();
}

module.exports = mongoose.model("RoomModel", roomSchema)