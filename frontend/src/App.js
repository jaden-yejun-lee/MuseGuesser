import logo from './logo.svg';
import React, {useState, useEffect} from 'react'
import './App.css';

function App() {
  const [token, setToken] = useState('')

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/spotify/token`)
      .then(response => response.json())
      .then(data => setToken(data.access_token))
      .catch(error => console.error("Error fetching token: ", error))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {token ? <p> Token: {token} </p> : <p>No token fetched</p>}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
