import React from "react";
import "./styles/ManageSessionPage.css";


function CreatePage() {
    return (
        <div className="create-session">
            <h1>Create Session</h1>
            <p>Here, you can create a new session. Add any necessary fields or instructions.</p>
            <form>
                <label>
                    Session Name:
                    <input type="text" placeholder="Enter session name" />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreatePage;