import React from 'react';
import img from "../assets/image/loading.gif"
function Loading(props) {
    return (
        <div className="loading">
            <img src={img} alt="" />
        </div>
        // <div className="load"></div >
    );
}

export default Loading;