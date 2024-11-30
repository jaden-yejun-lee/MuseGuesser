const GAME_STATES = {
    OPEN: "open",
    PENDING: "pending",
    STARTED: "started",
    CLOSED: "closed"
}

const ROOM_CODE_DIGITS = 4  // room code is 4-digits long

// Room where games are held
//  TODO: for now we store rooms in memory, and the total numbers
//      of active rooms in any given moment is assumed to be < 10000
class Room {
    static gameId = 0

    static codePair = {}

    constructor() {
        this.id         = ++Room.gameId             // id
        this.state      = GAME_STATES.OPEN          // game is by default open
        this.players    = new Set()                     // a set of players

        this.code = this.generateRoomCode()
        Room.codePair[this.code] = this              // generate room code & add to the dictionary
    }

    // generate room code, which is a number ROOM_CODE_DIGITS long
    generateRoomCode() {
        var code = this.id % (10 ** ROOM_CODE_DIGITS)
        while (code in Room.codePair) code = (code + 1) % (10 ** ROOM_CODE_DIGITS)
        return String(code).padStart(ROOM_CODE_DIGITS, '0')
    }
    getRoomCode() {
        return String(this.id).padStart(4, '0')
    }

    // get a room
    static getRoom(code) {
        return Room.codePair[code]
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
        this.state = GAME_STATES.PENDING
    }

    close() {
        this.state = GAME_STATES.CLOSED
        delete Room.codePair[this.code]   // reuse room ID
        this.saveGameRecords()

        // TODO: it might be beneficial to clean room ID & save records separately, in bulk
    }

    /* Clean-Up */
    // TODO: cleanup methods

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

    let room5 = new Room()

    for (let i = 0; i < 996; i++) {
        new Room()
    }

    console.log(Room.codePair)
}

module.exports = {
    Room
}