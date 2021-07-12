
import './App.css';
import axios from "axios"
import Login from './components/Login';
import Note from './components/Note';
import { useState, useEffect } from 'react';
function App() {

    const [isLogin, setIsLogin] = useState(false)
    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('tokenStore')
            if (token) {
                const verified = await axios.get('/users/verify', {
                    headers: { Authorization: token }
                })
                console.log(verified)
                setIsLogin(verified.data)
                if (verified.data === false) return localStorage.clear()
            } else {
                setIsLogin(false)
            }
        }
        checkLogin()
    }, [])
    return (
        <div className="App">
            <h4>Heloo appp</h4>
            {
                isLogin ? <Note setIsLogin={setIsLogin}></Note> : <Login setIsLogin={setIsLogin}></Login>
            }


        </div>
    );
}

export default App;
