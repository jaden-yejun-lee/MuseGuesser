import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './styles/FrontPage.css';

const FrontPage = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [doneDaily, setDoneDaily] = useState(false);
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const { userId, dailyScore } = JSON.parse(userData);
            if (userId) {
                setLoggedIn(true);
            }
            if (dailyScore !== -1) {
                setDoneDaily(true);
            }

        } else {
            setLoggedIn(false);
        }
    }, []);


    return (
        <div className="front-page">
            <h1>MuseGuesser</h1>
            <div className="links">
                {!doneDaily && loggedIn ? <Link to="/dailychallenge" className="link-button">Daily Challenge</Link> : null}
                {!loggedIn ?<>
                    <Link to="/signin" className="link-button">Sign In</Link>
                    <Link to="/signup" className="link-button">Sign Up</Link>
                </>:
                <>
                    <Link to="/room" className="link-button">Play Game</Link>
                    <Link to="/matchhistory" className="link-button">Match History</Link>
                </>}
            </div>
        </div>
    );
}

export default FrontPage;