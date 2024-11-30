import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SERVER = process.env.REACT_APP_SERVER;

const CreateJoinRoom = () => {
    const createRoom = async (e) => {
        try {
            const response = await fetch(`${SERVER}/game/createRoom`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Failed to create new rooms.");
            }

            const data = await response.json();
            console.log("Room created:", data);
          } catch (error) {
            console.error("Error creating room:", error);
          }
        };

    return (
        <div className="create-join-room">
            <h1>MuseGuesser</h1>
            <div className="links">
                <Link to="game" className="link-button" onClick={createRoom} >Create Room</Link>
                <Link to="join" className="link-button">Join Room</Link>
            </div>
        </div>
    );
}

export default CreateJoinRoom;
