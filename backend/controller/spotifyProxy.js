const { getAccessToken } = require("../utility/tokenManager");

/* Singleton class to manage all spotify-related Requests */
class SpotifyProxy {
    static instance = null;

    constructor() {
        this.cache = new Map()             // dictionary - trackId: trackInfo
        this.rateLimit = 0                      // rate limit estimate
        this.rlHandler = new CacheHandler()
    }

    // Singleton method
    getInstance() {
        // Create a singleton instance if none available
        if (instance == null) {
            SpotifyProxy.instance = new SpotifyProxy()
        }

        return SpotifyProxy.instance
    }

    // Add to cache
    addToCache(key, response) {
        const cacheDuration = CacheHandler.cacheDuration(this.rateLimit)

        // Store response with a timeout to remove it after cacheDuration
        const timeoutId = setTimeout(() => {
            this.cache.delete(key)
            console.log(`Cache expired for key: ${key}`)
        }, cacheDuration)

        this.cache.set(key, {response, timeoutId})
    }

    // Clear the cache
    clearCache() {
        // Clear all timeouts and cache entries
        for (const [key, { timeoutId }] of this.cache.entries()) {
            clearTimeout(timeoutId)
            this.cache.delete(key)
        }
    }

    // Get track with ID
    async getTrack(trackId) {
        if (!trackId in this.cache) {
            // request for specific track
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
                this.addToCache(trackId, response.data) // add to cache
              } catch (error) {
                // TODO: error handling
                throw error
              }
        }

        return this.cache[trackId]
    }

    // Recommends tracks from genre
    async recommendTracks(genres, limit = 10) {
        if (this.cache.size < limit) {
            try {
                const accessToken = await getAccessToken();
                const response = await axios.get(
                `https://api.spotify.com/v1/recommendations?seed_genres=${genres}&limit=${limit}`,
                {
                    headers: {
                    Authorization: `Bearer ${accessToken}`,
                    },
                }
                );

                for (const track in response.data.json().tracks) {
                    this.addToCache(track.id, track)
                }
            } catch (error) {
                // TODO: error handling
                throw error
            }
        }

        // TODO: Form recommendation from cache
        //      TODO: could race condition happens here?
    }
}

// Factory to produce different strategies handling rate limits
const LOW_RATE_CACHE = 600000               // 10 minutes
const MID_RATE_CACHE = LOW_RATE_CACHE * 2   // 20 minutes
const HIGH_RATE_CACHE = MID_RATE_CACHE * 2  // 40 minutes

class CacheHandler {
    constructor() {

    }

    static cacheDuration(rateLimit) {
        // TODO: strategies
        return LOW_RATE_CACHE
    }
}