const express = require('express')
const router = express.Router()
const axios = require('axios')
const query = require('querystring')

// Client ID and Secret
require("dotenv").config()
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

// Get spotify access token with client credentials flow
//  see https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
router.get('/token', async (req, res) => {
    console.log("Started to fetch token")

    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: query.stringify({
            grant_type: 'client_credentials'
        }),
        json: true
    }

    console.log("Forming authOptions: ", authOptions)

    try {
        const response = await axios(authOptions)
        res.json(response.data)
        console.log("Fetched token: ", response.data)
    } catch(error) {
        console.log("Failed to retrieve token")
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            console.log(error.request)
        } else {
            console.log("Error", error.message)
        }
        console.log(error.config)
    }
})

module.exports = router