const express = require('express')
require("dotenv").config()

const DumbProxy = require("../controller/dumbProxy")
// import { SpotifyProxy } from "../controller/spotifyProxy";
const { QuestionSet } = require("./questionSet")

// Spotify proxy
const proxy = DumbProxy.getInstance()

// Generate a question set
const generateQuestionSet = async(genre='pop', choices=4) => {
    let tracks = []
    let withPreview = []

    while (withPreview.length == 0) {
        tracks = await proxy.recommendTracks(genre, choices*2)    // increase the hit rate of preview_url
        withPreview = tracks.filter((track) => track.preview_url)
    }

    const correctTrack = withPreview[0]
    correctTrack.name = "Correct Track"
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
const generateQuestionSets = async(count, genre='pop', choices=4) => {
    let qss = []

    for (let i = 0; i < count; i++) {
        qss.push(await generateQuestionSet(genre, choices))
    }

    return qss
}

const test = async() => {
    let proxy = DumbProxy.getInstance()
    let qss = await generateQuestionSets(5)
    console.log(qss)
}

// test()

module.exports = {
    generateQuestionSet,
    generateQuestionSets
}