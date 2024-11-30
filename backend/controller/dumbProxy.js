const { getAccessToken } = require("../utility/tokenManager");
const axios = require('axios');
const ProviderProxy = require("./providerProxy");

/* Singleton class to manage all spotify-related Requests */
class DumbProxy extends ProviderProxy {
    static instance = null;

    // Singleton method
    static getInstance() {
        // Create a singleton instance if none available
        if (DumbProxy.instance == null) {
            DumbProxy.instance = new DumbProxy()
        }

        return DumbProxy.instance
    }

    // Get track with ID
    async getTrack(trackId) {
        console.log(`Trying to get track with id ${trackId}`)

        if (!(trackId in this.cache)) {
            // request for specific track
            console.log(`Requesting track with id ${trackId} from Spotify`)
            try {
                const accessToken = await getAccessToken();
                const response = await axios.get(
                  `https://api.spotify.com/v1/tracks/${trackId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                ).catch((error) => {console.log(error)});

                this.addToCache(trackId, response.data) // add to cache
              } catch (error) {
                // TODO: error handling
                throw error
              }
        }

        return this.cache[trackId]
    }

    // Recommends tracks from genre
    //  TODO: for now we assume there is only one genre
    async recommendTracks(genre, limit = 10) {
        // Dumb proxy provides a list of randomly-generated tracks
        let tracks = []
        for (let i = 0; i < limit; i++) {
            let track = {
                genre: genre,
                artists: [
                    {
                        "name": `Artist ${i + 1}`,
                    }
                ],
                name: `Track ${i + 1}`,
                preview_url: `dumb`   // empty
            }
            tracks.push(track)
        }
        return tracks
    }
}

async function test() {
    let proxy = DumbProxy.getInstance()
    let tracks = await proxy.recommendTracks("pop")
    console.log(tracks)
}

// test()

module.exports = DumbProxy