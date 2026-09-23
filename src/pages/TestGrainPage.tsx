// src/pages/TestGrainPage.tsx — página temporária só para visualizar o GrainGradient
import React from 'react';
import GrainGradient from '../components/GrainGradient';

const TestGrainPage: React.FC = () => {
    return (
        <GrainGradient width="100vw" height="100vh" grainIntensity={0.09}>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '3rem', textAlign: 'center' }}>GRAIN GRADIENT</h1>
            </div>
        </GrainGradient>
    );
};

export default TestGrainPage;
