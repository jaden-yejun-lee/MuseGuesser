import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/DailyChallenge.css"
import { MdOutlineReplay } from "react-icons/md";

const SERVER = process.env.REACT_APP_SERVER;

const DailyChallengePage = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null); // Daily challenge data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentRound, setCurrentRound] = useState(0); // Track the current question
  const [isPlaying, setIsPlaying] = useState(false); // Whether a question is active
  const [audio, setAudio] = useState(null); // Audio player
  const [volume, setVolume] = useState(50);  // Audio volume
  const [startTime, setStartTime] = useState(null); // Start time for scoring
  const [points, setPoints] = useState(0); // Total points
  const [message, setMessage] = useState(""); // Feedback messages
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [gameState, setGameState] = useState("ready"); // "ready", "playing", or "finished"
  const navigate = useNavigate();

  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);
  const { dailyScore } = JSON.parse(userData);

  // Fetch daily challenge from start of page
  useEffect(() => {
    const fetchDailyChallenge = async () => {
      if (!userId) {
        setError("Please log in to play the daily challenge");
        navigate("/login");
        return;
      }

      if (dailyScore !== -1) {
        setAlreadyPlayed(true);
        setMessage("You have already played the daily challenge. Wait another day.");
        return;
      }

      try {
        const response = await fetch(`${SERVER}/game/dailyChallenge`);
        if (!response.ok) {
          throw new Error("Failed to fetch daily challenge.");
        }
        const data = await response.json();
        setDailyChallenge(data);

        setTimeout(() => {
          setGameState("playing");
        }, 5000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  // Automatically play audio for the current question when in "playing" state
  useEffect(() => {
    if (
      dailyChallenge &&
      currentRound < dailyChallenge.questions.length &&
      gameState === "playing"
    ) {
      playAudio();
    }
  }, [currentRound, dailyChallenge, gameState]);

  const playAudio = () => {
    if (!dailyChallenge || !dailyChallenge.questions || isPlaying) return;

    const currentQuestion = dailyChallenge.questions[currentRound];
    const newAudio = new Audio(currentQuestion.correctTrack.preview_url);
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);
    setStartTime(Date.now());
    setMessage(""); // Clear the message when starting a new question
  };

  // Volume change functionality
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  // Replay functionality
  const handleReplay = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play(); // replay the song, not adjusting start time
    }
  };

  // Push score to database
  const saveScoreToDatabase = async (finalScore) => {
    try {
      const response = await fetch(`${SERVER}/game/updateDailyScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          score: finalScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score to database.");
      }

      const data = await response.json();
      console.log("Score saved successfully:", data);

      const updatedUserData = {
        ...JSON.parse(localStorage.getItem("userData")),
        dailyScore: finalScore,
      };
      
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    } catch (error) {
      console.error("Error saving score:", error);
    }
    try{

      const getusername_response = await fetch(`${SERVER}/account/getUsername`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (!getusername_response.ok) {
        throw new Error("Failed to get username.");
      }

      const username_data = await getusername_response.json();
      const username = username_data.username;
      console.log("Username acquired:", username);

      const match_response = await fetch(`${SERVER}/match/uploadMatch`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: "Daily Challenge",
          date: new Date(),
          players: [
            {
              username: username,
              score: finalScore,
            },
          ],
      })
    });
    if (!match_response.ok) {
      throw new Error("Failed to save match to database.");
    }
    console.log("Match saved successfully");

    } catch (error) {
      console.error("Error saving match:", error);
    }
  };

  // Handle answer submit
  const handleAnswerSelection = (selectedAnswer) => {
    if (!isPlaying) return;

    // Stop the audio
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setIsPlaying(false);

    const currentQuestion = dailyChallenge.questions[currentRound];
    const correctAnswer = currentQuestion.correctTrack.name;

    let earnedPoints = 0;

    if (selectedAnswer === correctAnswer) {
      const timeElapsed = (Date.now() - startTime) / 1000; // Time in seconds
      const initialPoints = 100; // Max points
      const decayRate = 0.05; // Decay rate for points
      // Exponential decay logic
      earnedPoints = Math.round(
        initialPoints * Math.exp(-decayRate * timeElapsed)
      );
      setPoints((prevPoints) => prevPoints + earnedPoints); // Update total points
      setMessage(`Correct! You earned ${earnedPoints} points.`);
    } else {
      setMessage("Incorrect. You earned 0 points.");
    }

    // Proceed to the next round or finish the game
    if (currentRound + 1 < dailyChallenge.questions.length) {
      setTimeout(() => setCurrentRound((prevRound) => prevRound + 1), 5000);
    } else {
      setTimeout(async () => {
        const finalScore = points + earnedPoints;
        setGameState("finished");
        setMessage(`Game over! Your total score is ${finalScore}.`);

        // Save the final score to the database
        await saveScoreToDatabase(finalScore);
      }, 5000);
    }
  };

  if (alreadyPlayed) {
    return (
      <div className="daily-challenge-container">
        <h2>{message}</h2>
        <button
          className="leaderboard-button"
          onClick={() => navigate("/dailychallenge/leaderboard")}
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentQuestion = dailyChallenge.questions[currentRound];

  return (
    <div className="daily-challenge-container">
      <h1>Daily Challenge</h1>

      {gameState === "ready" && (
        <div>
          <h2>Get Ready to Play the Daily Challenge!</h2>
        </div>
      )}

      {gameState === "playing" && (
        <div>
          <div className="question-section">
            <h3>Question {currentRound + 1}</h3>
            <button className="replay-button" onClick={handleReplay}>
              <MdOutlineReplay size={24} /> Replay
            </button>
          </div>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(option.name)}
              >
                {`${option.name} - ${option.artist}`}
              </button>
            ))}
          </div>
          <h4>Total Points: {points}</h4>
          {message && <div className="feedback">{message}</div>}

          <div className="volume-control">
            <label htmlFor="volume-slider">Volume:</label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
            <span id="volume-value">{volume}%</span>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div>
          <h2>Game Over!</h2>
          <p>{message}</p>
          <h4>Your Total Points: {points}</h4>

          <button
            className="leaderboard-button"
            onClick={() => navigate("/dailychallenge/leaderboard")}
          >
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyChallengePage;
