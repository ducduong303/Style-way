import React from 'react';
import img from "../assets/image/loadTable.gif"
function LoadingTable(props) {
    return (
        <div className="loadingTable">
            <img src={img} alt="" />
        </div>
    );
}

export default LoadingTable;