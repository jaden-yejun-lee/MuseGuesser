import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SignUpPage.css';

const SERVER = process.env.REACT_APP_SERVER;
console.log(SERVER);

// TO DO: EMAIL VERIFICATION SYSTEM

const SignUpPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    function handleSubmit(e) {
        e.preventDefault(); // stop the page transition
    
        const email = e.target.email.value;
        const username = e.target.username.value; // username OR email
        const password = e.target.password.value; // password
    
        fetch(`${SERVER}/account/signup`, { // send request to backend
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
          }).then((response) => {
            // response is a status code
            // 200: user exists
            // 201: email exists
            // 202: both exist
            // 203: neither exist, create user
            // 204: invalid email
            switch (response.status) {
              case 200:
                setLoginError('Username already taken!');
                break;
              case 201:
                setLoginError('Email already taken!');
                break;
              case 202:
                setLoginError('Username and email already taken!');
                break;
              case 203:
                setLoginError('');
                console.log('User created!')
                navigate('/signin');
                break;
              case 500:
                alert('Server error');
                break;
              default:
                alert('Error: Non 200 status code');
            }}).catch((error) => {
            console.error('Error:', error);
          });
              
    }

    return (
        <>
            <h1 className='signUpHeader'>Record/Remember Your Login Info (Username + Password)</h1>
            <form className='signUpForm' onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label><br/>
                <input type="email" id="email" name="email" required/><br/>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Sign Up"/>

                {loginError && <p className="error">{loginError}</p>}
            </form>
        </>
    );
}

export default SignUpPage;