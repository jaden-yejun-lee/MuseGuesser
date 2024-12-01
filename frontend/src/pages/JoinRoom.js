import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/JoinRoom.css';


const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  
  const userData = localStorage.getItem("userData");
  const { userId } = JSON.parse(userData);
  
  const SERVER = process.env.REACT_APP_SERVER;

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

      navigate("/room/game", {
        state: {
          code: data.code,
          questionSets: data.questionSets,
          progress: data.progress,
          score: data.score
        }
      });
    } catch (error) {
      alert("Failed to join room");
      console.error("Error joining room:", error);
    }
  };

  const handleInputChange = (e) => {
    const code = e.target.value;
    if (/^\d{0,4}$/.test(code)) {
      setRoomCode(code);
    }
  };

  const handleJoinClick = () => {
    if (roomCode.length === 4) {
      joinRoom(roomCode);
    } else {
      alert("Please enter a valid 4-digit code.");
    }
  };

  return (
    <div className="front-page">
      <h1>Join a Room</h1>
      <div className="content-container">
        <div className="input-container">
          <input
            type="text"
            maxLength="4"
            value={roomCode}
            onChange={handleInputChange}
            placeholder="Enter 4-digit code"
            className="room-input"
          />
        </div>
        <div className="button-container">
          <button onClick={handleJoinClick} className="link-button">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;