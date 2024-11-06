const express = require('express');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const authRoutes = require('./routes/auth.js')

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const db = require('./db.js');

// Routes
// --- authentification
app.use('/api/auth', authRoutes)

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});