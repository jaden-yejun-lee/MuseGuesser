import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage.js';
import SignUpPage from './pages/SignUpPage.js';
import App from './App.js';


const PageRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h>FRONT PAGE</h>
                    <a href="/game">Game</a>
                    <a href="/signin">Sign In</a>
                    <a href="/signup">Sign Up</a>
                </div>
                } />
                <Route path="/game" element={<><App/></>} />
                <Route path="/signin" element={<><SignInPage/></>} />
                <Route path="/signup" element={<><SignUpPage/></>} />
            </Routes>
        </Router>
    );
}

export default PageRouter;