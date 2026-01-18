import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti'; // Import confetti
import './App.css'; 

const BalloonSky = () => {
    const [balloons, setBalloons] = useState([]);
    // To help find elements for animation without relying on e.target state issues
    const balloonRefs = useRef({}); 

    // 🎈 CONFIGURATION: What floats up?
    // We only add threads to the '🎈' icon later.
    const ICONS = ['🎈', '❤️', '✨', '🎂', '💖', '🎈']; 

    useEffect(() => {
        const initialBalloons = Array.from({ length: 12 }).map((_, i) => createBalloon(i));
        setBalloons(initialBalloons);

        const interval = setInterval(() => {
            setBalloons(prev => {
                const newBalloons = prev.filter(b => !b.isPopped); // Clean up popped ones
                if (newBalloons.length > 40) newBalloons.shift(); 
                return [...newBalloons, createBalloon(Date.now())];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const createBalloon = (id) => {
        const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
        // Only real balloons get a thread
        const hasThread = randomIcon === '🎈';
        
        const left = Math.random() * 100;       
        const duration = Math.random() * 20 + 20; // Slower ascent (20-40s)
        const size = Math.random() * 1 + 2; // (2rem - 3rem)
        
        return { id, icon: randomIcon, left, duration, size, hasThread, isPopped: false };
    };

    const popBalloon = (e, id) => {
        e.stopPropagation();

        // 1. 🎉 TRIGGER DECORATIVE PAPER POP (CONFETTI)
        // Calculate click position relative to the screen (0.0 to 1.0)
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        confetti({
            particleCount: 40, // Quick burst
            spread: 60,
            origin: { x, y },
            colors: ['#FFC0CB', '#FFD700', '#ffffff', '#FF69B4'], // Pink, Gold, White theme
            ticks: 100, // Disappear faster
            gravity: 1.2,
            scalar: 0.8 // Smaller papers
        });

        // 2. VISUAL POP ANIMATION
        const element = balloonRefs.current[id];
        if (element) {
            element.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";
            element.style.transform = "scale(1.4)";
            element.style.opacity = "0";
        }

        // 3. Remove from state after animation finishes
        setTimeout(() => {
             setBalloons(prev => prev.map(b => b.id === id ? {...b, isPopped: true} : b));
        }, 150);
    };

    return (
        <div className="balloon-container">
            {balloons.map(b => (
                !b.isPopped && (
                <div
                    key={b.id}
                    ref={el => balloonRefs.current[b.id] = el}
                    className="floating-wrapper"
                    style={{
                        left: `${b.left}%`,
                        animationDuration: `${b.duration}s`,
                    }}
                    onClick={(e) => popBalloon(e, b.id)}
                >
                    {/* The Icon (Balloon/Heart) */}
                    <div className="balloon-content" style={{ fontSize: `${b.size}rem` }}>
                        {b.icon}
                    </div>

                    {/* ➰ The Spiral Thread (Only for balloons) */}
                    {b.hasThread && (
                        <svg className="balloon-thread" viewBox="0 0 30 120" preserveAspectRatio="none">
                             {/* A wavy spiral path */}
                             <path 
                                d="M15,0 C 25,15 5,30 15,45 C 25,60 5,75 15,90 C 20,100 15,110 15,120" 
                                stroke="rgba(255,255,255,0.6)" 
                                strokeWidth="1.5" 
                                fill="none" 
                             />
                        </svg>
                    )}
                </div>
                )
            ))}
        </div>
    );
};

export default BalloonSky;