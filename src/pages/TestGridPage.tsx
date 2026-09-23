// src/pages/TestGridPage.tsx — página temporária só para visualizar o PerspectiveGrid
import React from 'react';
import PerspectiveGrid from '../components/PerspectiveGrid';

const TestGridPage: React.FC = () => {
    return (
        <PerspectiveGrid width="100vw" height="100vh" speed={1}>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '3rem', textAlign: 'center' }}>PERSPECTIVE GRID</h1>
            </div>
        </PerspectiveGrid>
    );
};

export default TestGridPage;
