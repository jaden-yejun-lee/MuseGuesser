const { RoomModel } = require("../db")
const { Player } = require("./player")

const GAME_STATES = {
    OPEN: "open",
    PENDING: "pending",
    STARTED: "started",
    CLOSED: "closed"
}

class ExpirationHandler {
    static INSTANT_EXPIRATION = 5 * 1000    // 5 seconds, note that this causes error since it is shorter than a game session
    static SHORT_EXPIRATION = 35 * 1000     // 35 seconds
    static QUICK_EXPIRATION = 5 * 60 * 1000 // 5 minutes
    static MID_EXPIRATION = 10 * 60 * 1000  // 10 minutes
    static LONG_EXPIRATION = 15 * 60 * 1000 // 15 minutes

    static getExpiration() {
        // TODO: conditional
        return ExpirationHandler.SHORT_EXPIRATION
    }
}

const ROOM_CODE_DIGITS = 4  // room code is 4-digits long

// Room where games are held
//  TODO: for now we store rooms in memory, and the total numbers
//      of active rooms in any given moment is assumed to be < 10000
class Room {
    static gameId = 0

    static codePair = {}

    static cleanupTimeoutId = null  // storing timeout for periodic cleanup

    constructor() {
        this.id         = ++Room.gameId             // id
        this.state      = GAME_STATES.OPEN          // game is by default open
        this.players    = new Map()                 // a map of players
        this.questionSets = []                      // questionSets

        this.model      = new RoomModel()           // database model

        this.code = this.generateRoomCode()
        Room.codePair[this.code] = this             // generate room code & add to the dictionary

        console.log(Room.codePair)
    }

    // generate room code, which is a number ROOM_CODE_DIGITS long
    generateRoomCode() {
        var code = this.id % (10 ** ROOM_CODE_DIGITS)
        while (code in Room.codePair) code = (code + 1) % (10 ** ROOM_CODE_DIGITS)
        return String(code).padStart(ROOM_CODE_DIGITS, '0')
    }
    getRoomCode() {
        return this.code
    }

    // get a room
    static getRoom(code) {
        return Room.codePair[code]
    }

    /* Functionalities */
    join(player) {
        console.log("Player %s join room %d", player, this.id)
        this.#addPlayer(player)
    }

    exit(player) {
        this.#removePlayer(player)
    }

    // Save this room (results) to database
    async saveGameRecords() {
        await this.model.saveGameRecords(Array.from(this.players.values()))    // save player records
        console.log("Room %s records saved.", this.getRoomCode())
    }

    // players
    #addPlayer(player) {    // Player
        this.players.set(player.id, player)
    }

    #removePlayer(player) {
        this.players.delete(player.id)
    }

    /* Switch States */
    open() {
        this.state = GAME_STATES.OPEN
    }

    start() {
        this.state = GAME_STATES.STARTED
    }

    stop() {
        this.state = GAME_STATES.PENDING
    }

    close() {
        this.state = GAME_STATES.CLOSED
        delete Room.codePair[this.code]   // reuse room ID
        this.saveGameRecords()

        // TODO: it might be beneficial to clean room ID & save records separately, in bulk
    }

    /* Question Sets */
    addQuesitonSet(questionSet) {
        this.questionSets.push(questionSet)
    }

    addQuestionSets(questionSets) {
        this.questionSets.push(...questionSets)
    }

    /* Clean-Up */
    // TODO: cleanup methods
    cleanup() {
        // Update active/inactive
        for (let [id, player] of this.players) {
            if ((Date.now() - player.lastUpdate) > ExpirationHandler.getExpiration()) { // expires
                console.log("Player %s set to inactive.", id)
                player.state = Player.STATE.INACTIVE
            }
        }

        // Scan for inactivity
        for (let [id, player] of this.players) {
            if (player.state == Player.STATE.ACTIVE) return;
        }
        console.log("Room %s now closed due to inactivity.", this.code)

        // Close the room since all players are inactive for a while
        this.close()
    }

    // Static cleanup
    //  -- period: in seconds
    static periodicCleanup(period=60) {
        // if (Room.cleanupTimeoutId !== null) {
        //     return  // period cleanup already in progress
        // }

        Room.cleanupTimeoutId = setTimeout(() => {
            console.log("Room: periodic cleanup (%ds) begins", period)
            for (let [code, room] of Object.entries(Room.codePair)) {
                room.cleanup()
            }
            console.log("Room: periodic cleanup (%ds) ends", period)
            Room.periodicCleanup(period)
        }, period * 1000)
    }

    /* Getters */
    get playerCount() {
        return this.players.size
    }
}

function test() {
    let room1 = new Room()
    let room2 = new Room()
    let room3 = new Room()
    let room4 = new Room()

    console.log(Room.codePair)
    room3.close()

    room4.saveGameRecords()

    let room5 = new Room()

    console.log(Room.codePair)
}

// test()

module.exports = {
    Room
}