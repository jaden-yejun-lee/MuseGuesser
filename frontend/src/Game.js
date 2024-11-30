import React, { useState } from "react";
import "./Game.css";
import { useLocation } from "react-router-dom";
import QuestionComponent from "./pages/components/QuestionComponent";

const SERVER = process.env.REACT_APP_SERVER;

function Game() {
  const [selectedGenre, setSelectedGenre] = useState(""); // state to hold genre
  const [answerOptions, setAnswerOptions] = useState([]); // state to hold 4 answer options
  const [correctAnswer, setCorrectAnswer] = useState(""); // state to hold correct answer
  const [isPlaying, setIsPlaying] = useState(false);      // state to hold current round
  const [audio, setAudio] = useState(null);               // state to hold audio player
  const [startTime, setStartTime] = useState(null);       // state to hold time
  const [points, setPoints] = useState(0);                // state to hold points
  const [round, setRound] = useState(1);
  const [idx, setIdx] = useState(0);                      // state to hold which question we are playing

  const location = useLocation()
  const { state } = location || {}

  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);

  // play random previewurl
  const playRandomPreview = async () => {


    try {
      const response = await fetch(
        `${SERVER}/songModel/recommendations?genres=${selectedGenre}&limit=30`
      );
      const data = await response.json();

      // only get tracks with previewurls
      const tracksWithPreview = data.tracks.filter((track) => track.preview_url);

      if (tracksWithPreview.length >= 4) {
        // pick one random song as correct answer
        const correctTrack = tracksWithPreview[Math.floor(Math.random() * tracksWithPreview.length)];
        // get 3 wrong answers
        const incorrectTracks = tracksWithPreview
          .filter((track) => track !== correctTrack)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        // combine and shuffle all 4 answer choices
        const options = [correctTrack, ...incorrectTracks].sort(() => 0.5 - Math.random());

        setAnswerOptions(options);
        setCorrectAnswer(`${correctTrack.name} - ${correctTrack.artists[0].name}`);

        // play the correct song
        const newAudio = new Audio(correctTrack.preview_url);
        newAudio.play();
        setAudio(newAudio);
        setIsPlaying(true);
        setStartTime(Date.now());
      } else {
        alert("Not enough previews available for this genre.");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };


  const handleAnswerSelection = (answer) => {
    // stop playing song
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setIsPlaying(false);
    if (answer === correctAnswer) {
      const earnedPoints = calculateScore()
      setPoints((prevPoints) => prevPoints + earnedPoints);
      // NEED TO MODIFY AFTER
      alert(`Correct! ${earnedPoints} points.`);
    } else {
      alert(
        `Incorrect. 0 points.`
      );
    }
  };

  // Handle answer submission to the server for verification
  const handleAnswerSubmission = async(idx, selectedOption, elapsedTime) => {
    const score = calculateScore(elapsedTime) // local score

    try {
      const response = await fetch(`${SERVER}/game/submitAnswer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: state.code,       // room code
          userId: userId,         // userId
          idx: idx,               // qSet index
          choice: selectedOption, // index of selected option
          score: score            // local score
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer.");
      }

      const data = await response.json();
      console.log("Server feedback:", data);

      // Post-verifcation
      if (data.correct === true) {  // correct answer
        setPoints(points + data.score)
        alert("Correct answer!")
      } else {
        alert("Wrong answer!")
      }

      // Increase current index
      setIdx(idx + 1)

    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  }

  // Calculate local score when submitting answer
  const calculateScore = (elapsedTime) => {
    // exponential decay calculation for points
    const timeElapsed = (elapsedTime) / 1000;
    const initialPoints = 100;  // max possible points
    const decayRate = 0.05;     // how quickly points decrease over time
    const earnedPoints = Math.round(initialPoints * Math.exp(-decayRate * timeElapsed));

    return earnedPoints
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Room {state.code}</h1>
        <h4>Total Points: {points}</h4>

        {idx < state.questionSets.length ? (
          <QuestionComponent idx={idx} questionSet={state.questionSets[idx]} onSubmit={handleAnswerSubmission}/>
        ) : (
          <p>You have completed all the questions! Congratulations!</p>
        )}
      </header>
    </div>
  );
}

export default Game;
