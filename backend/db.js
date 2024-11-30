// This file is like a bus for the models to server.js

const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});

// import models from /models

const Song = require('./models/songModel.js');
const User = require('./models/userModel.js');
const DailyChallenge = require('./models/dailyChallenge.js')
const Match = require('./models/matchModel.js');
const RoomModel = require('./models/roomModel.js')

module.exports = {User, Song, DailyChallenge, Match, RoomModel};
