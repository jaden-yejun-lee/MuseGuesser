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