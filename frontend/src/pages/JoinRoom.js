import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = process.env.REACT_APP_SERVER;

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");

  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);

  const navigate = useNavigate()

  // Default join room mechanism
  const joinRoom = async (code) => {
    try {
      const response = await fetch(`${SERVER}/game/joinRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          userId: userId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to join room.");
      }

      const data = await response.json();
      console.log("Joined room:", data);

      navigate("/room/game", {state: {code: data.code}})
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  const handleInputChange = (e) => {
    const code = e.target.value;
    if (/^\d{0,4}$/.test(code)) {
      // Only allow up to 4 digits
      setRoomCode(code);
    }
  };

  const handleJoinClick = () => {
    if (roomCode.length === 4) {
      joinRoom(roomCode); // Trigger the join action with the room code
    } else {
      alert("Please enter a valid 4-digit code.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Join a Room</h2>
      <div style={styles.inputContainer}>
        <label htmlFor="room-code">Enter Room Code:</label>
        <input
          id="room-code"
          type="text"
          maxLength="4"
          value={roomCode}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="1234"
        />
      </div>
      <button onClick={handleJoinClick} style={styles.button}>
        Join Room
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    margin: "10px 0",
    textAlign: "center",
  },
  input: {
    width: "200px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    textAlign: "center",
    marginTop: "5px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default JoinRoom;
