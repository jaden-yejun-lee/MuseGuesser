const mongoose = require('mongoose')

const ROOM_STATES = {
    PENDING: "pending", // when a room is set but the game hasn't started
    STARTED: "started", // when the game has started
    CLOSED: "closed"    // when the room is closed 
}

const roomSchema = new mongoose.Schema({
    code: {type: String, required: true},   // room code as an id
})