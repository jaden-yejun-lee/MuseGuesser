import React, {useState, useEffect} from 'react';
import './styles/MatchHistory.css';

const SERVER = process.env.REACT_APP_SERVER;

const MatchHistory = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            setError("Please log in to view match history");
            setLoading(false);
            return;
        }
        const { userId } = JSON.parse(userData);

        fetch(`${SERVER}/match/matchHistory`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch match history.");
                }
                response.json().then((data) => {
                    setMatches(data);
                    setLoading(false);
                });
                
            }).catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);


    return(<>
                <h1>Match History</h1>
                {loading ? <p>Loading...</p> : <div className='match-history'>
                    {Array.isArray(matches) && matches.length === 0 ? <p>No matches found</p> : 
                     matches.map((match, index) => {
                        return(<div key={index} className='match'>
                                 <p>{match.gameType}</p>
                                 <p>{match.date}</p>
                                 {match.players
                                 .sort((a, b) => b.score - a.score)
                                 .map((player, index) => {
                                    return(<div key={index} className='player'>
                                             <p>{player.username}</p>
                                             <p>{player.score}</p>
                                           </div>)
                                 })}
                               </div>)
                     })
                    }
                </div>}
                {error ? <p>{error}</p> : null}
                
           </>)
}

export default MatchHistory;