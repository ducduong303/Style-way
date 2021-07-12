import React from 'react';

function Note({ setIsLogin }) {

    const handleLogout = () => {
        localStorage.clear()
        setIsLogin(false)
    }
    return (
        <div>

            <button onClick={handleLogout}>LogOut</button>
            <h4>Đây là page note</h4>
        </div>
    );
}

export default Note; <h4>Đây là page note</h4>