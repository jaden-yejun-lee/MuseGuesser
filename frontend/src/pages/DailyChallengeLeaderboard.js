import React, { useEffect, useState } from "react";
import "./styles/Leaderboard.css"; // Import the CSS file

const SERVER = process.env.REACT_APP_SERVER;

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(`${SERVER}/game/dailyChallengeScores`); 
        const data = await response.json();
        let user_list = data.users;
        user_list.sort((a,b) => b.dailyScore - a.dailyScore); 
        console.log(response.status);
        setLeaderboardData(user_list);
        setLoading(false);
      } catch (err) {
        setError("Failed to load leaderboard data.");
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Daily Challenge Leaderboard</h1>
      </div>
      <div className="leaderboard-content">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player, index) => (
              <tr 
                key={player.id} 
                className={`leaderboard-row ${index === 0 ? 'first-place' : 
                             index === 1 ? 'second-place' : 
                             index === 2 ? 'third-place' : ''}`}
              >
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.dailyScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
