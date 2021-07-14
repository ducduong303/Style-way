import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 28, color: "#000" }} spin />;

function LoadingSection({ height }) {
    const styles = height ? height : null
    return (
        <div className="loading-Section" style={{ height: styles }}>
            <Spin indicator={antIcon} />
        </div>
    );
}

export default LoadingSection;