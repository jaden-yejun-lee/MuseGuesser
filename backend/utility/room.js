import './game'

ROOM_STATES = {
    PENDING: "pending",
    STARTED: "started",
    CLOSED: "closed"
}

const ROOM_CODE_DIGITS = 4  // room code is 4-digits long

// Room where games are held
//  TODO: for now we store rooms in memory, and the total numbers
//      of active rooms in any given moment is assumed to be < 10000
class Room extends Game {
    static codePair = {}

    constructor() {
        super()

        this.code = this.generateRoomCode()
        codePair[this.code] = this              // generate room code & add to the dictionary
    }

    // generate room code, which is a number ROOM_CODE_DIGITS long
    generateRoomCode() {
        var code = this.id % (10 ** ROOM_CODE_DIGITS)
        while (code in codePair) code = (code + 1) % (10 ** ROOM_CODE_DIGITS)
        return String(code).padStart(ROOM_CODE_DIGITS, '0')
    }
    getRoomCode() {
        return String(this.id).padStart(4, '0')
    }

    // start a room and begins the game
    start() {

    }

    // close a room
    close() {
        Room.idSet.delete(this.id)  // reuse roomID
    }

    // add a player to the room
    addPlayer(player) {
        this.players.push(player)
    }

    // close a room
    static closeRoom(room) {
        this.idSet.delete(room.id)  // reuse roomID
    }
}

