import React from 'react';
import img from "../assets/image/loading.gif"
function LoadingScreen(props) {
    return (
        <div className="loading-screen">
            <img src={img} alt="" />
        </div>
        // <div className="load"></div >
    );
}

export default LoadingScreen;