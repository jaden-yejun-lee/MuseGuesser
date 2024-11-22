import React, { useState } from "react";
import "./Game.css";

function Game() {
  const [selectedGenre, setSelectedGenre] = useState(""); // state to hold genre
  const [answerOptions, setAnswerOptions] = useState([]); // state to hold 4 answer options
  const [correctAnswer, setCorrectAnswer] = useState(""); // state to hold correct answer
  const [isPlaying, setIsPlaying] = useState(false);      // state to hold current round
  const [audio, setAudio] = useState(null);               // state to hold audio player
  const [startTime, setStartTime] = useState(null);       // state to hold time
  const [points, setPoints] = useState(0);                // state to hold points

  // play random previewurl
  const playRandomPreview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/songModel/recommendations?genres=${selectedGenre}&limit=30`
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
      // exponential decay calculation for points
      const timeElapsed = (Date.now() - startTime) / 1000;
      const initialPoints = 100;  // max possible points
      const decayRate = 0.05;     // how quickly points decrease over time
      const earnedPoints = Math.round(initialPoints * Math.exp(-decayRate * timeElapsed));
      setPoints((prevPoints) => prevPoints + earnedPoints);
      // NEED TO MODIFY AFTER
      alert(`Correct! ${earnedPoints} points.`);
    } else {
      alert(
        `Incorrect. 0 points.`
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <label>
          Select Genre:
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="" disabled>
              Choose Genre
            </option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="jazz">Jazz</option>
          </select>
        </label>

        <button onClick={playRandomPreview}>Get Random Preview</button>

        {isPlaying && answerOptions.length > 0 && (
          <div>
            <h3>Guess the Track:</h3>
            {answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() =>
                  handleAnswerSelection(`${option.name} - ${option.artists[0].name}`)
                }
              >
                {`${option.name} - ${option.artists[0].name}`}
              </button>
            ))}
          </div>
        )}
        <h4>Total Points: {points}</h4>
      </header>
    </div>
  );
}

export default Game;
