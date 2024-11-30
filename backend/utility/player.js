// Player model used in Rooms
class Player {  // player is specific to room
    constructor(userId) {
        this.id         = userId        // unique identifier
        this.score      = 0             // starts with 0 score
        this.lastUpdate = Date.now()    // last update
    }

    // Is the player expired?
    isExpired(expiration = 1000 * 60 * 5) { // default to be 5 minutes
        return Date.now() > this.lastUpdate + expiration
    }

    // Add score
    addScore(delta) {
        this.score += delta
        this.update()
    }

    // Pulse - update lastUpdate
    update() {
        this.lastUpdate = Date.now()
    }
}

module.exports = {
    Player
}