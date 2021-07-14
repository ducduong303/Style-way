import React from 'react';

function TitleCustom({ name }) {

    return (
        <div className="title-custom">
            <div className="container">
                <div className="title-custom-box">
                    <h4>Sản phẩm</h4>
                    <h4>{name}</h4>
                </div>
            </div>

        </div>
    );
}

export default TitleCustom;