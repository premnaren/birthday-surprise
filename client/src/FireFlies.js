import React, { useEffect, useState } from 'react';
import './App.css'; 

const Fireflies = () => {
    const [fireflies, setFireflies] = useState([]);

    useEffect(() => {
        // Create 25 fireflies with random positions and speeds
        const initialFireflies = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,      // Random horizontal %
            top: Math.random() * 100,       // Random vertical %
            animationDuration: Math.random() * 10 + 10, // 10s to 20s speed
            delay: Math.random() * 5        // Random start delay
        }));
        setFireflies(initialFireflies);
    }, []);

    return (
        <div className="firefly-container">
            {fireflies.map(f => (
                <div 
                    key={f.id}
                    className="firefly"
                    style={{
                        left: `${f.left}%`,
                        top: `${f.top}%`,
                        animationDuration: `${f.animationDuration}s`,
                        animationDelay: `${f.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

export default Fireflies;
