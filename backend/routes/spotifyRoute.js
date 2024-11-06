const express = require('express')
const router = express.Router()
const axios = require('axios')
const query = require('querystring')
const { getAccessToken } = require('../utility/tokenManager')

// Client ID and Secret
require("dotenv").config()

// Get spotify access token with client credentials flow
//  see https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
router.get('/token', async (req, res) => {
    try {
        const accessToken = await getAccessToken()
        res.json({
            success: true,
            access_token: accessToken
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve access token",
            details: error.message
        })
    }
})

module.exports = router