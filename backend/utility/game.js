const express = require('express')

require("dotenv").config()

// Game states
GAME_STATES = {
    OPEN: "open",
    STARTED: "started",
    CLOSED: "closed",
    STOPPED: "stopped"
}

// this class stores a game's state in server's memory
class Game {
    static gameId = 0

    constructor() {
        this.id         = ++gameId              // id
        this.state      = GAME_STATES.OPEN      // game is by default open
        this.players    = set()                 // a set of players
    }

    /* Functionalities */
    join(player) {
        this.#addPlayer(player)
    }

    exit(player) {
        this.#removePlayer(player)
    }

    saveGameRecords() {
        // TODO: database-related method
        return null
    }

    // players
    #addPlayer(player) {
        this.players.add(player)
    }

    #removePlayer(player) {
        this.players.delete(player)
    }

    /* Switch States */
    open() {
        this.state = GAME_STATES.OPEN
    }

    start() {
        this.state = GAME_STATES.STARTED
    }

    stop() {
        this.state = GAME_STATES.STOPPED
    }

    close() {
        this.state = GAME_STATES.CLOSED
    }

    /* Getters */
    get id() {
        return this.id
    }

    get state() {
        return this.state
    }

    get playerCount() {
        return this.players.size
    }
}