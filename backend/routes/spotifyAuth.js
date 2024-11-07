const express = require("express");
const router = express.Router();
const axios = require("axios");
const query = require("querystring");
require("dotenv").config();

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
// we need expiration time bc spotify tokens refresh every hour
let tokenExpirationTime = 0; 

async function fetchAccessToken() {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: query.stringify({ grant_type: "client_credentials" }),
  };

  try {
    const response = await axios(authOptions);
    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    console.log("Fetched new token:", response.data);
  } catch (error) {
    console.error("Failed to retrieve token:", error);
  }
}

// route to manually get or refresh token
router.get("/token", async (req, res) => {
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    await fetchAccessToken();
  }
  res.json({ accessToken });
});

// function to get a valid token
async function getAccessToken() {
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    await fetchAccessToken();
  }
  return accessToken;
}

module.exports = { router, getAccessToken };
