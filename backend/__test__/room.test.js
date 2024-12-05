const { Room } = require('../utility/room');
const { Match, RoomModel } = require('../db');
const { Player } = require('../utility/player');

// Mock the Match dependency
jest.mock('../db', () => ({
  Match: jest.fn().mockImplementation(() => ({
    saveGameRecords: jest.fn(async () => {
      console.log("Mocked saveGameRecords called");
    }),
  })),
}));

describe("Room Class Tests", () => {
  beforeEach(() => {
    Room.gameId = 0;
    Room.codePair = {};
    jest.clearAllMocks();
  });

  test("Room instance is created with correct initial state", () => {
    const room = new Room();
    expect(room.id).toBe(1);
    expect(room.state).toBe("open");
    expect(room.players.size).toBe(0);
    expect(room.code).toMatch(/^\d{4}$/); // Ensure 4-digit room code
    expect(Room.codePair[room.code]).toBe(room);
  });

  test("Room generates unique room codes", () => {
    const room1 = new Room();
    const room2 = new Room();
    expect(room1.code).not.toBe(room2.code);
    expect(Object.keys(Room.codePair)).toHaveLength(2);
  });

  test("Players can join and leave the room", () => {
    const room = new Room();
    const player = { id: 1, name: "TestPlayer" };

    room.join(player);
    expect(room.players.has(player.id)).toBe(true);

    room.exit(player);
    expect(room.players.has(player.id)).toBe(false);
  });

  test("Room cleanup removes inactive players and closes room", () => {
    const room = new Room();
    const activePlayer = { id: 1, lastUpdate: Date.now(), state: Player.STATE.ACTIVE };
    const inactivePlayer = { id: 2, lastUpdate: Date.now() - 360000, state: Player.STATE.INACTIVE };

    room.join(activePlayer);
    room.join(inactivePlayer);

    room.cleanup();
    expect(inactivePlayer.state).toBe(Player.STATE.INACTIVE);   // INACTIVE
    expect(room.state).toBe("open");

    activePlayer.state = Player.STATE.INACTIVE;
    room.cleanup();
    expect(room.state).toBe("closed")
  });

  test("Room.periodicCleanup triggers cleanup periodically", async () => {
    jest.useFakeTimers();
    const room = new Room();
    const player = { id: 1, lastUpdate: Date.now() - 360000, state: Player.STATE.ACTIVE };

    room.join(player);
    Room.periodicCleanup(1); // Run cleanup every second

    jest.advanceTimersByTime(1000);
    expect(player.state).toBe(Player.STATE.INACTIVE);   // 0: INACTIVE
    jest.useRealTimers();
  });

  test("Room adds and retrieves question sets", () => {
    const room = new Room();
    const questionSet1 = ["Question 1"];
    const questionSet2 = ["Question 2"];

    room.addQuesitonSet(questionSet1);
    room.addQuestionSets([questionSet2]);
    expect(room.questionSets).toEqual(expect.arrayContaining([questionSet1, questionSet2]));
  });

  test("Get room by code", () => {
    const room = new Room();
    const fetchedRoom = Room.getRoom(room.code);

    expect(fetchedRoom).toBe(room);
  });
});
