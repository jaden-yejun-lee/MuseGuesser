import React from 'react';
import { Link } from 'react-router-dom';
import './styles/FrontPage.css';

const FrontPage = () => {
    return (
        <div className="front-page">
            <h1>MuseGuesser</h1>
            <div className="links">
                <Link to="/dailychallenge" className="link-button">Daily Challenge</Link>
                <Link to="/signin" className="link-button">Sign In</Link>
                <Link to="/signup" className="link-button">Sign Up</Link>
            </div>
        </div>
    );
}

export default FrontPage;