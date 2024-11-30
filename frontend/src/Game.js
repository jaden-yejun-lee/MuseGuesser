import React, { useState } from "react";
import "./Game.css";
import { useLocation } from "react-router-dom";
import QuestionComponent from "./pages/components/QuestionComponent";
import TimeoutBar from "./pages/components/TimeoutBar";

const SERVER = process.env.REACT_APP_SERVER;

function Game() {
  const location = useLocation()
  const { state } = location || {}

  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);

  const [selectedGenre, setSelectedGenre] = useState(""); // state to hold genre
  const [answerOptions, setAnswerOptions] = useState([]); // state to hold 4 answer options
  const [correctAnswer, setCorrectAnswer] = useState(""); // state to hold correct answer
  const [isPlaying, setIsPlaying] = useState(false);      // state to hold current round
  const [audio, setAudio] = useState(null);               // state to hold audio player
  const [points, setPoints] = useState(state.score);      // state to hold points
  const [idx, setIdx] = useState(state.progress);         // state to hold which question we are playing
  const [resetTrigger, setResetTrigger] = useState(0)     // state to hold timeout reset trigger

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
        console.log("Correct answer!")
      } else {
        console.log("Wrong answer!")
      }

      // Increase current index
      setIdx(idx + 1)

      // Reset timeout
      setResetTrigger(resetTrigger + 1)
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

  // Timeout handler
  const handleTimeout = () => {
    console.log("Timeout!")

    // Increase current index
    setIdx(idx + 1)

    // Reset timeout
    setResetTrigger(resetTrigger + 1)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Room {state.code}</h1>
        <h4>Total Points: {points}</h4>

        {idx < state.questionSets.length ? (
          <>
            <TimeoutBar totalTime={30} onTimeout={handleTimeout} resetTrigger={resetTrigger}/>
            <QuestionComponent idx={idx} questionSet={state.questionSets[idx]} onSubmit={handleAnswerSubmission}/>
          </>
        ) : (
          <p>You have completed all the questions! Congratulations!</p>
        )}
      </header>
    </div>
  );
}

export default Game;
