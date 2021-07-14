import React, { useState } from 'react';

function Comment(props) {

    const [comment,setComment] = useState("")
    return (
        <div>
            {/* <input type="text" placeholder="Nhập nhận xét" onChange/> */}
            <button>Gửi</button>
        </div>
    );
}

export default Comment;