import React from 'react';

const Offline = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            color: '#1f2937',
        }}>
            <h1>You are offline</h1>
            <p>Please check your internet connection and try again.</p>
        </div>
    );
};

export default Offline;
