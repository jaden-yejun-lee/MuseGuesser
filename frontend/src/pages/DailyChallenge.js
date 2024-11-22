import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = process.env.REACT_APP_SERVER;

const DailyChallengePage = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null); // Daily challenge data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentRound, setCurrentRound] = useState(0); // Track the current question
  const [isPlaying, setIsPlaying] = useState(false); // Whether a question is active
  const [audio, setAudio] = useState(null); // Audio player
  const [startTime, setStartTime] = useState(null); // Start time for scoring
  const [points, setPoints] = useState(0); // Total points
  const [message, setMessage] = useState(""); // Feedback messages
  const [gameState, setGameState] = useState("ready"); // "ready", "playing", or "finished"
  const navigate = useNavigate();

  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);
  const { dailyScore } = JSON.parse(userData)

  // Fetch daily challenge on component mount
  useEffect(() => {
    const fetchDailyChallenge = async () => {
        if (!userId) {
          setError("Please log in to play the daily challenge");
          navigate("/login"); // Redirect to login if no userId found
          return;
        }

        if (dailyScore !== -1) {
          alert("You have already played the daily challenge. Wait another day.");
          navigate("/game");
        }

      try {
        const response = await fetch(`${SERVER}/game/dailyChallenge`);
        if (!response.ok) {
          throw new Error("Failed to fetch daily challenge.");
        }
        const data = await response.json();
        setDailyChallenge(data);

        // Start the "Get Ready" timer
        setTimeout(() => {
          setGameState("playing");
        }, 5000); // 5-second delay for the "Get Ready" screen
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

  const saveScoreToDatabase = async (finalScore) => {
    console.log('userId from DailyChallenge(FE): ', userId);
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
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

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

    let earnedPoints = 0; // Points for this round

    if (selectedAnswer === correctAnswer) {
      const timeElapsed = (Date.now() - startTime) / 1000; // Time in seconds
      const initialPoints = 100; // Max points
      const decayRate = 0.05; // Decay rate for points
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
      setTimeout(() => setCurrentRound((prevRound) => prevRound + 1), 2000); // 5-second delay
    } else {
      setTimeout(async () => {
        // Calculate the final score directly
        const finalScore = points + earnedPoints; // Add the last round's points
        setGameState("finished");
        setMessage(`Game over! Your total score is ${finalScore}.`);

        // Save the final score to the database
        await saveScoreToDatabase(finalScore);
      }, 2000); // 5-second delay
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (
    !dailyChallenge ||
    !dailyChallenge.questions ||
    dailyChallenge.questions.length === 0
  ) {
    return <div>No daily challenge available. Please try again later.</div>;
  }

  const currentQuestion = dailyChallenge.questions[currentRound];

  return (
    <div className="App">
      <h1>Daily Challenge</h1>

      {/* Ready Screen */}
      {gameState === "ready" && (
        <div>
          <h2>Get Ready to Play the Daily Challenge!</h2>
        </div>
      )}

      {/* Game Playing */}
      {gameState === "playing" && (
        <div>
          <h3>Question {currentRound + 1}</h3>
          {isPlaying && (
            <div>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option.name)}
                >
                  {`${option.name} - ${option.artist}`}
                </button>
              ))}
            </div>
          )}
          <h4>Total Points: {points}</h4>
          {message && <div className="feedback">{message}</div>}
        </div>
      )}

      {/* Game Over */}
      {gameState === "finished" && (
        <div>
          <h2>Game Over!</h2>
          <p>{message}</p>
          <h4>Your Total Points: {points}</h4>
        </div>
      )}
    </div>
  );
};

export default DailyChallengePage;
