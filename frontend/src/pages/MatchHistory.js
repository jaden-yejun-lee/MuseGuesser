import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/MatchHistory.css';


const SERVER = process.env.REACT_APP_SERVER;

const MatchHistory = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            setError("Please log in to view match history");
            setLoading(false);
            return;
        }
        const { userId } = JSON.parse(userData);

        fetch(`${SERVER}/match/matchHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch match history.");
            }
            response.json().then((data) => {
                setMatches(data);
                setLoading(false);
            });
        }).catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    return (
      <div className="front-page">
        <h1>Match History</h1>
        <div className="content-container">
          {loading ? (
            <div className="status-message loading">Loading...</div>
          ) : error ? (
            <div className="status-message error">{error}</div>
          ) : Array.isArray(matches) && matches.length === 0 ? (
            <div className="status-message empty">No matches found</div>
          ) : (
            <div className="matches-container">
              {matches.map((match, index) => (
                <div key={index} className="match-card">
                  <div className="match-header">
                    <span className="game-type">{match.gameType}</span>
                    <span className="match-date">{match.date}</span>
                  </div>
                  <div className="players-list">
                    {match.players
                      .sort((a, b) => b.score - a.score)
                      .map((player, playerIndex) => (
                        <div key={playerIndex} className="player-row">
                          <span className="player-name">{player.username}</span>
                          <span className="player-score">{player.score}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/")} // Navigate to the front page
        >
          Exit Match History
        </button>
      </div>
    );
}

export default MatchHistory;