const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getAccessToken } = require("../utility/tokenManager");

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

  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch track data" });
  }
});

// Get recommendation from genre
router.get("/recommendations", async (req, res) => {
  const { genres, limit = 10 } = req.query; // Default to "pop" if genres is not provided
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/recommendations?seed_genres=${genres}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
