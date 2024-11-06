const express = require('express')
const query = require('querystring')
const axios = require('axios')

// Client ID and Secret
require("dotenv").config()
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

// Spotify Access Token
let accessToken = ""
let tokenExpires = 0        // when the token expires, milliseconds UTC
let refreshTimeout = null   // timeout for the next refresh

// Max Retries to get Token
const PRELOAD_INT = 300000      // refresh PRELOAD_INT milliseconds before actual token expiration
const MAX_RETRIES = 10          // max retries when asking spotify server for an access token

// Fetch the access token
//  returns (access_token, expires_in) or throws an error
const fetchToken = async() => {
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

    console.log("Formed authOptions")

    try {
        const response = await axios(authOptions)

        console.log("Fetched token: ", response.data)
        return [response.data.access_token, response.data.expires_in]
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
        throw error
    }
}

// Fetch and stores the token, along with its expiration
const fetchAndStoreToken = async() => {
    try {
        let expiresIn
        [accessToken, expiresIn] = await fetchToken()
        tokenExpires = Date.now() + expiresIn * 1000    // converts seconds to milliseconds UTC
        scheduleTokenRefresh(expiresIn)                 // schedule a refresh
        return accessToken
    } catch(error) {
        console.log("Error fetching and storing token")
        throw error
    }
}

// Schedule a token refresh to occur after expires_in seconds
const scheduleTokenRefresh = (expiresIn) => {
    console.log(`Scheduling token-refresh in ${expiresIn * 1000 - PRELOAD_INT} milliseconds`)

    // Clear existing timeout event
    if (refreshTimeout) {
        clearTimeout(refreshTimeout)
    }

    // Schedule a new timeout event
    refreshTimeout = setTimeout(fetchAndStoreToken, expiresIn * 1000 - PRELOAD_INT)
}

// Get access token
//  automaticlaly get a new one if token already timeout
const getAccessToken = async() => {
    console.log(accessToken)
    console.log(Date.now(), tokenExpires)

    // Get new token if don't have one / token expired
    if (!accessToken || Date.now() >= tokenExpires) {
        let count = 0
        while (true) {
            try {
                await fetchAndStoreToken()
                break
            } catch(error) {
                // TODO: handling error
                if (++count == MAX_RETRIES) throw error
            }
        }
    }
    return accessToken
}

module.exports = {
    getAccessToken
}