// handle saved games
const express = require("express");
const router = express.Router();

const matchModel = require("../models/matchModel.js");
const userModel = require("../models/userModel.js");

// routes: upload match, get match history

router.post("/uploadMatch", (req, res) => {
    // get match data from req
    const gameType = req.body.gameType;
    const date = req.body.date;
    const players = req.body.players;
    let match = new matchModel({
        gameType: gameType,
        date: date,
        players: players
    });
    match.save().then(() => {
        res.status(200).send("Match uploaded successfully.");
    }).catch((error) => {
        console.error("Error uploading match:", error);
        res.status(500).json({ error: "Internal server error." });
    });
});

router.get("/matchHistory", (req, res) => {
    // get all matches with req userid
    const userid = req.body.id;
    // find username associated with userid
    userModel.findById(userid).then((user) => {
        matchModel.find(
            {players: { $elemMatch: { username: user.username } } }
        ).then((matches) => {
            res.json(matches);
        }).catch((error) => {
            console.error("Error fetching match history:", error);
            res.status(500).json({ error: "Internal server error." });
        });
    }).catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error." });
    });
});

module.exports = router;