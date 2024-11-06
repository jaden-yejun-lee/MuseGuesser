const express = require('express');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const spotifyAuth = require('./routes/spotifyAuth.js')

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const db = require('./db.js');
const { getAccessToken } = require('./utility/tokenManager.js');

// Routes
// --- Spotify access token
app.use('/api', spotifyAuth)

console.log(`Initial token: ${getAccessToken()}`)

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});