import React, { useEffect, useState } from "react";
import "./styles/Leaderboard.css"; // Import the CSS file

const SERVER = process.env.REACT_APP_SERVER;


const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(`${SERVER}/game/dailyChallengeScores`
        ); 
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="leaderboard-container">
    <h1 className="leaderboard-title">Daily Challenge Leaderboard</h1>
        <table className="leaderboard-table">
        <thead>
          <tr>
            <th style={styles.cell}>Rank</th>
            <th style={styles.cell}>Username</th>
            <th style={styles.cell}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={player.id}>
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{player.username}</td>
              <td style={styles.cell}>{player.dailyScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for the leaderboard
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "0 auto",
  },
  cell: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
};

export default Leaderboard;
