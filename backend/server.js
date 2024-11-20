const express = require('express');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const spotifyRouter = require('./routes/spotifyRouter.js');
const accountRouter = require('./routes/accountRouter.js');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const db = require('./db.js');

// Routes
// --- Spotify access token
app.use('/api/spotify', spotifyRouter);
// spotify song routes
app.use('/songModel', spotifyRouter);
// user account routes
app.use('/account', accountRouter);


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});