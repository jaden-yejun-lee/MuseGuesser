import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SERVER = process.env.REACT_APP_SERVER;

const CreateJoinRoom = () => {
    const userData = localStorage.getItem("userData");
    const { userId } = JSON.parse(userData);

    const navigate = useNavigate()

    const createRoom = async (e) => {
        try {
            const response = await fetch(`${SERVER}/game/createRoom`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId
              })
            });

            if (!response.ok) {
              throw new Error("Failed to create new rooms.");
            }

            const data = await response.json();
            console.log("Room created:", data);

            navigate("game", {state: {code: data.code}})
          } catch (error) {
            console.error("Error creating room:", error);
          }
        };

    return (
        <div className="create-join-room">
            <h1>MuseGuesser</h1>
            <div className="links">
                <button onClick={createRoom}>Create Room</button>
                <Link to="join" className="link-button">Join Room</Link>
            </div>
        </div>
    );
}

export default CreateJoinRoom;
