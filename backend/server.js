const express = require('express');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const spotifyRouter = require('./routes/spotifyRouter.js');
const accountRouter = require('./routes/accountRouter.js');
const gameRouter = require('./routes/gameRouter.js');

const {runCronJob} = require("./utility/dailyChallengeScheduler.js");



const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const db = require('./db.js'); // connect to database

// Routes
// --- Spotify access token
app.use('/api/spotify', spotifyRouter);
// spotify song routes
app.use('/songModel', spotifyRouter);
// user account routes
app.use('/account', accountRouter);
// game routes
app.use('/game', gameRouter);


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

cron.schedule("0 0 * * *", async () => {
  console.log(`Cron job executed at: ${new Date().toISOString()}`);
  await runCronJob();
}, {
  timezone: "America/Los_Angeles",
});

// uncomment this and run server to generate new dailychallenge questions
// runCronJob();