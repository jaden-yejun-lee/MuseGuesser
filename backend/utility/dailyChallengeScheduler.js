const cron = require("node-cron");
const DailyChallenge = require("../models/dailyChallenge");
const User = require("../models/userModel");
const port = process.env.PORT || 5000;

// How long we should keep past daily challenge questions in days
const RETENTION_PERIOD = 7

function normalizeDate(date) {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
}

async function generateDailyTracks() {
    const genres = ['pop', 'rock', 'hip-hop', 'electronic', 'classical'];
    const questions = []
 
    for (let i = 0; i < 5; i++) {
        let genre = genres[i];

        try {
            const response = await fetch(
              `http://localhost:${port}/songModel/recommendations?genres=${genre}&limit=50`
            );
            const data = await response.json();
            const tracksWithPreview = data.tracks.filter((track) => track.preview_url);
            if (tracksWithPreview.length < 4) {
                throw new Error("Not enough tracks with previews for genre: ", genre);
            }

            const correctTrack = tracksWithPreview[Math.floor(Math.random() * tracksWithPreview.length)];
            const incorrectTracks = tracksWithPreview
                .filter((track) => track !== correctTrack)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            const options = [correctTrack, ...incorrectTracks].sort(() => 0.5 - Math.random());

            questions.push({
              correctTrack: {
                name: correctTrack.name,
                artist: correctTrack.artists[0].name,
                preview_url: correctTrack.preview_url,
              },
              options: options.map((track) => ({
                name: track.name,
                artist: track.artists[0].name,
              })),
            });

            
            
        } catch (error) {
            console.error("Error generating daily tracks:", error);
            throw new Error("Failed to generate daily challenge tracks.");
        }
    }

    return questions;
}

async function runCronJob() {
    try {
      // create new challenge for today
      const newChallenge = {
        date: normalizeDate(new Date()),
        questions: await generateDailyTracks(),
      };

      // push new challenge to mongodb
      await DailyChallenge.findOneAndUpdate(
        { date: newChallenge.date },
        newChallenge,
        { upsert: true }
      );

      // reset all users daily score to -1
      await User.updateMany({}, { $set: { dailyScore: -1 } });

      // delete challenges older than a week
      const cutoffDate = normalizeDate(
        new Date(Date.now() - RETENTION_PERIOD * 24 * 60 * 60 * 1000)
      );
      const result = await DailyChallenge.deleteMany({
        date: { $lt: cutoffDate },
      });
      console.log(`Deleted ${result.deletedCount} old challenges.`);
    } catch (error) {
      console.error("Error running CronJobs application: ", error);
    }
}

module.exports = {runCronJob}