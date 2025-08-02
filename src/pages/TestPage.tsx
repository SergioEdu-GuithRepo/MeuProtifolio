// src/pages/TestPage.tsx

import React from 'react';

// Esta página é o mais simples possível.
const TestPage: React.FC = () => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white'
        }}>
            <h1 style={{ color: 'black', fontSize: '5rem' }}>
                A PÁGINA DE TESTE FUNCIONA!
            </h1>
        </div>
    );
};

export default TestPage;