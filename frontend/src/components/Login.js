import React, {useState} from "react";
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL // auth server URL

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            console.log(`${API_URL}/api/auth/login`)
            const response = await axios.post(`${API_URL}/api/auth/login`, {email, password})    // TODO: this is plaintext
            const {token} = response.data
            localStorage.setItem('token', token)
            alert("Login successful")
        }
        catch (err) {
            setError("Invalid email or password")
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login