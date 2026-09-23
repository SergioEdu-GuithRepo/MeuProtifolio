// src/pages/TestPage.tsx

import React from 'react';
import { BlackHole } from '../components/BlackHole';

// Esta página é o mais simples possível.
const TestPage: React.FC = () => {
    return (
        <BlackHole
            width="100vw"
            height="100vh"
            cursorInteraction
            cursorIntensity={1}
            holeRadius={0.15}
            glow={1}
            lensStrength={2}
        >
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h1 style={{ color: 'white', fontSize: '3rem', textAlign: 'center' }}>
                    BLACK HOLE TEST
                </h1>
            </div>
        </BlackHole>
    );
};

export default TestPage;
