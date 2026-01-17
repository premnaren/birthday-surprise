import React, { useState, useEffect, useRef } from 'react';
import FlowerGarden from './FlowerGarden';
import './App.css'; 

// 📸 CONFIGURATION: Your photos in 'public' folder
const PHOTOS = [
    "/pic1.jpg", 
    "/pic2.jpg", 
    "/pic3.jpg", 
    "/pic4.jpg",
    "/pic5.jpg" 
];

const BirthdayReveal = () => {
    // --- STATE ---
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // Tracks top card
    
    const audioRef = useRef(null);

    // --- 1. THEME LOGIC ---
    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    // --- 2. SHUFFLE TIMER ---
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
        }, 3500); // Speed: New photo every 3.5 seconds

        return () => clearInterval(interval);
    }, []);

    // --- 3. HANDLERS ---
    const handleCurtainClick = () => {
        setCurtainOpen(true);
        if (audioRef.current) audioRef.current.play().catch(e => console.log(e));
    };

    return (
        <div className="birthday-container">
            <div style={{zIndex: 0}}><FlowerGarden /></div>
            <audio ref={audioRef} loop><source src="/song.mp3" /></audio>

            {/* THEME TOGGLE */}
            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
                <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
            </div>

            {/* CURTAIN */}
            <div className={`curtain ${curtainOpen ? 'open' : ''}`} onClick={handleCurtainClick} style={{zIndex: 200}}>
                <div className="curtain-content">
                    <h1>🎉 A Surprise Awaits! 🎉</h1>
                    <p>Click to Reveal</p>
                    <div className="bounce-arrow">⬆️</div>
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="birthday-card" style={{zIndex: 10}}>
                <h1 className="bday-title">🎉 Happy Birthday! 🎉</h1>
                
                {/* 🃏 THE POLAROID STACK 🃏 */}
                <div className="polaroid-stack">
                    {PHOTOS.map((photo, index) => {
                        // Calculate specific role for animation
                        let className = "polaroid-card";
                        
                        // The Top Card (Visible)
                        if (index === currentIndex) className += " active";
                        // The Card that just left (Flying away)
                        else if (index === (currentIndex - 1 + PHOTOS.length) % PHOTOS.length) className += " prev";
                        // The Card waiting behind (Peeking)
                        else if (index === (currentIndex + 1) % PHOTOS.length) className += " next";
                        // Others (Hidden)
                        else className += " hidden"; 

                        return (
                            <div key={index} className={className}>
                                <div className="polaroid-inner">
                                    <img src={photo} alt="Memory" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* NOTE SECTION */}
                <div className="note-section">
                    {!noteOpen ? (
                        <div className="folded-note" onClick={() => setNoteOpen(true)}>
                            <div className="heart-seal">❤️</div>
                            <p>Read My Letter</p>
                        </div>
                    ) : (
                        <div className="note-content open" onClick={() => setNoteOpen(false)}>
                            <p>
                                To my favorite person,<br/><br/>
                                Flipping through these photos reminds me of how lucky I am.
                                Every memory with you is my favorite.
                                <br/><br/>
                                Happy Birthday! 🎂
                            </p>
                            <p className="signature">Love, <br/> <strong>Prem</strong> ❤️</p>
                            <span className="close-hint">(Click to close)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RESET */}
            <button onClick={() => { if(window.confirm("Reset?")) { localStorage.clear(); window.location.reload(); }}} className="reset-btn" style={{zIndex: 100}}>
                🔄 Reset
            </button>
        </div>
    );
};

export default BirthdayReveal;