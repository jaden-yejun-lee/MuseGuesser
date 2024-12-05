const DumbProxy = require('../controller/dumbProxy');

describe("DumbProxy Class", () => {
    let dumbProxy;

    beforeEach(() => {
        DumbProxy.instance = null;              // reset singleton instance before each test
        dumbProxy = DumbProxy.getInstance();
    });

    test("getInstance should return a singleton instance", () => {
        const instance1 = DumbProxy.getInstance();
        const instance2 = DumbProxy.getInstance();

        expect(instance1).toBe(instance2);      // Singleton, references should point to the same instance
    });

    test("recommendTracks should return the correct number of tracks", async () => {
        const genre = "pop";
        const limit = 5;
        const tracks = await dumbProxy.recommendTracks(genre, limit);

        expect(tracks).toHaveLength(limit); // correct number of tracks
        tracks.forEach((track, index) => {
            expect(track).toHaveProperty("genre", genre);
            expect(track).toHaveProperty("name", `Track ${index + 1}`);
            expect(track).toHaveProperty("preview_url", "dumb");
            expect(track).toHaveProperty("artists");
            expect(track.artists).toHaveLength(1);
            expect(track.artists[0]).toHaveProperty("name", `Artist ${index + 1}`);
        });
    });

    test("recommendTracks should work with a default limit", async () => {
        const genre = "rock";
        const tracks = await dumbProxy.recommendTracks(genre); // default limit is 10

        expect(tracks).toHaveLength(10); // Check default limit
        tracks.forEach((track, index) => {
            expect(track).toHaveProperty("genre", genre);
            expect(track).toHaveProperty("name", `Track ${index + 1}`);
        });
    });

    test("recommendTracks should return empty if limit is 0", async () => {
        const genre = "jazz";
        const limit = 0;
        const tracks = await dumbProxy.recommendTracks(genre, limit);

        expect(tracks).toHaveLength(0); // should return 0 tracks
    });
});
