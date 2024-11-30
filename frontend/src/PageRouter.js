import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage.js';
import SignUpPage from './pages/SignUpPage.js';
import FrontPage from './pages/FrontPage.js';
import Game from './Game.js';
import DailyChallengePage from './pages/DailyChallenge.js';
import DailyChallengeLeaderboard from './pages/DailyChallengeLeaderboard.js';
import CreatePage from "./pages/CreatePage.js";
import JoinPage from "./pages/JoinPage.js";


const PageRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><FrontPage/></>} />
                <Route path="/game" element={<><Game/></>} />
                <Route path="/signin" element={<><SignInPage/></>} />
                <Route path="/signup" element={<><SignUpPage/></>} />
                <Route path="/dailychallenge" element={<><DailyChallengePage/></>} />
                <Route path="/dailychallenge/leaderboard" element={<><DailyChallengeLeaderboard/></>} />
                <Route path="/create" element={<><CreatePage/></>} />
                <Route path="/join" element={<><JoinPage/></>} />

            </Routes>
        </Router>
    );
}

export default PageRouter;