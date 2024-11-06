const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Login = require('../models/Login')
const HttpStatus = require('http-status-codes')

const router = express.Router()
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET

// login route
router.post('/login', async (request, response) => {
    const {email, password} = request.body  // TODO: this is in plaintext

    // find user by email
    const user = await Login.findOne({email})
    if (!user) {
        console.log("User not found")
        return response.status(HttpStatus.StatusCodes.BAD_REQUEST).json({error: "User not found"})
    }

    // compare password
    // TODO: we can consider salting the password as a part of security enhancement
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        console.log("Invalid password")
        return response.status(HttpStatus.StatusCodes.BAD_REQUEST).json({error: "Invalid password"})
    }

    // create JWT token
    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'})
    response.json({token})
})

module.exports = router