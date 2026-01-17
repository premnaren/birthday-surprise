import React, { useState, useCallback } from 'react';
import './App.css';

const BalloonSky = () => {
    const [balloons, setBalloons] = useState([]);

    const createBalloon = useCallback(() => {
        const id = Date.now();
        // Random starting position horizontally (0% to 90%)
        const left = Math.floor(Math.random() * 90);
        // Randomize speed slightly (between 4s and 7s)
        const duration = Math.floor(Math.random() * 3) + 4;
        // Pick one of 5 theme colors
        const colorIdx = Math.floor(Math.random() * 5);

        setBalloons(prev => [...prev, { id, left, duration, colorIdx }]);

        // Remove balloon after it floats off-screen to prevent lag
        setTimeout(() => {
            setBalloons(prev => prev.filter(b => b.id !== id));
        }, duration * 1000);
    }, []);

    return (
        // This container covers the screen and listens for clicks
        <div className="balloon-sky-container" onClick={createBalloon}>
            {balloons.map(b => (
                <div
                    key={b.id}
                    className={`balloon color-${b.colorIdx}`}
                    style={{
                        left: `${b.left}%`,
                        animationDuration: `${b.duration}s`
                    }}
                >
                    {/* The little string hanging down */}
                    <div className="string"></div>
                </div>
            ))}
        </div>
    );
};

export default BalloonSky;