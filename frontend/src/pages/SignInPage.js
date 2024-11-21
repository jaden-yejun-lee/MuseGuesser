import { useNavigate } from 'react-router-dom';


import './styles/SignInPage.css';
const SERVER = process.env.REACT_APP_SERVER;
console.log(SERVER);


// TODO:
// HANDLE RESPONSE FROM SERVER
// IMPLEMENT NAVIGATION

const SignInPage = () => {

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const username = event.target['username'].value; // username OR email
        const password = event.target['password'].value; // password
        
        // send request to backend
        fetch(`${SERVER}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        }).then(response => {
            // response is an error code
            switch(response.status){
                case 200:
                // successful login
                navigate('/game');
                break;
                case 201:
                // unsuccessful login
                alert('Incorrect username, email, or password');
                break;
                case 500:
                // server error
                alert('Server error');
                break;
                default:
                // unknown error
                alert('Unknown error');
                console.log(response.status);
            }
        })

    }
    

    return(
        <>
            <h1 className='signInHeader'>Sign In</h1>
            <form className='signInForm' onSubmit={handleSubmit}>
                <label htmlFor="username">Username or Email:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Log In"/>
            </form>
        </>
    );
}

export default SignInPage;