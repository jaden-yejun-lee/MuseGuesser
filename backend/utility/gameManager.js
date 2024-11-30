import { SpotifyProxy } from "../controller/spotifyProxy";
import { QuestionSet } from "./questionSet";

// Spotify proxy
const proxy = SpotifyProxy.getInstance()

// Generate a question set
const generateQuestionSet = (genre='pop', choices=4) => {
    let tracks = []
    let withPreview = []

    while (withPreview.length == 0) {
        tracks = proxy.recommendTracks(genre, choices*2)    // increase the hit rate of preview_url
        withPreview = tracks.filter((track) => track.preview_url)
    }

    const correctTrack = withPreview
    const incorrectTracks = tracks
                .filter((track) => track !== correctTrack)
                .sort(() => 0.5 - Math.random())
                .slice(0, choices - 1);
    const correct = Math.floor(Math.random() * choices)
    const finalTracks = [
        ...incorrectTracks.slice(0, correct),
        correctTrack,
        ...incorrectTracks.slice(correct)
    ]

    let qs = new QuestionSet(finalTracks, correct)  // generate question sets
    return qs
}

// Generate question sets
const generateQuestionSets = (count, genre='pop', choices=4) => {
    let qss = []

    for (let i = 0; i < count; i++) {
        qss.push(generateQuestionSet(genre, choices))
    }

    return qss
}

module.exports = {
    generateQuestionSet,
    generateQuestionSets
}