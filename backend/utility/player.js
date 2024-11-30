// Player model used in Rooms
class Player {  // player is specific to room
    constructor(userId) {
        this.id         = userId        // unique identifier
        this.score      = 0             // starts with 0 score
        this.progress   = 0             // idx of question set the player has reached
        this.lastUpdate = Date.now()    // last update
    }

    // Is the player expired?
    isExpired(expiration = 1000 * 60 * 5) { // default to be 5 minutes
        return Date.now() > this.lastUpdate + expiration
    }

    // Add score
    addScore(delta) {
        this.score += delta
        this.pulse()
    }

    // Answer question
    updateProgress(idx) {
        this.progress = idx + 1
        this.pulse()
    }

    // Update the index of question set the player has reached
    answered(idx) {
        return idx < this.progress
    }

    // Pulse - update lastUpdate
    pulse() {
        this.lastUpdate = Date.now()
    }
}

module.exports = {
    Player
}