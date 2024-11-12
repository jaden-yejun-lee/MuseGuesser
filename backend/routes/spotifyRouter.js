const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getAccessToken } = require("../utility/tokenManager");
const { SpotifyProxy } = require('../controller/spotifyProxy')

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

// Get track from track ID
router.get("/track/:id", async (req, res) => {
  const trackId = req.params.id;
  const spotify = SpotifyProxy.getInstance();

  try {
    res.json(spotify.getTrack(trackId))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch track data" });
  }
});

// Get recommendation from genre
router.get("/recommendations", async (req, res) => {
  const { genres, limit = 30 } = req.query; // Default to "pop" if genres is not provided
  const spotify = SpotifyProxy.getInstance();

  try {
    console.log("Requesting a random track of genre", genres)
    const track = await spotify.getRandomTrackByGenre(genres)  // TODO: for now we assume there is one genre
    res.json(track)
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
