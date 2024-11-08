import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // state for genre
  const [selectedGenre, setSelectedGenre] = useState("");

  // play random previewurl
  const playRandomPreview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/songModel/recommendations?genres=${selectedGenre}&limit=10`
      );
      const data = await response.json();

      // only get tracks with previewurls
      const tracksWithPreview = data.tracks.filter(
        (track) => track.preview_url
      );

      // set random previewurl
      if (tracksWithPreview.length > 0) {
        const randomTrack =
          tracksWithPreview[
            Math.floor(Math.random() * tracksWithPreview.length)
          ];
        const previewUrl = randomTrack.preview_url;

        // set audio and play
        const audio = new Audio(previewUrl);
        audio.play();
      } else {
        alert("No previews available for this genre.");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
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
            <option value=""
              disabled>Choose Genre
            </option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="jazz">Jazz</option>

          </select>
        </label>

        <button onClick={playRandomPreview}>Get Random Preview</button>
      </header>
    </div>
  );
}

export default App;
