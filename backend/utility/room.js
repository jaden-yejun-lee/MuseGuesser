ROOM_STATES = {
    PENDING: "pending",
    STARTED: "started",
    CLOSED: "closed"
}

// Room where games are held
//  TODO: for now we store rooms in memory, and the total numbers
//      of active rooms in any given moment is assumed to be < 10000
const Room = class {
    static roomID = 0
    static idSet = new Set([])

    constructor() {
        Room.roomID = (Room.roomID + 1) % 10000           // increment room id
        while (Room.idSet.has(++Room.roomID)) {}     // omit repetitive ids 
        Room.idSet.add(Room.roomID)
        
        this.id         = Room.roomID           // id
        this.state      = ROOM_STATES.PENDING   // current state
        this.players    = []                    // list of players, referred to by id's
    }

    // generate room code, which is a 4-digit number
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

