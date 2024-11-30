import React from "react";
import "./styles/ManageSessionPage.css";

function JoinPage() {
    return (
        <div className="join-session">
            <h1>Join Session</h1>
            <p>Enter the session code to join an existing session.</p>
            <form>
                <label>
                    Session Code:
                    <input type="text" placeholder="Enter session code" />
                </label>
                <button type="submit">Join</button>
            </form>
        </div>
    );
}

export default JoinPage;