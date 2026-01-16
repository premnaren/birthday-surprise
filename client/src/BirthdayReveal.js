import React, { useState, useEffect, useRef } from 'react';
import FlowerGarden from './FlowerGarden';
import './App.css'; // Ensure CSS is linked

const BirthdayReveal = () => {
    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const audioRef = useRef(null);

    // --- 1. THEME LOGIC ---
    useEffect(() => {
        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark);

        if (isDark) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    // --- 2. MUSIC CONTROL ---
    const handleCurtainClick = () => {
        setCurtainOpen(true);
        // Try to play music when user interacts (browsers block auto-play)
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    return (
        <div className="birthday-container" style={{ 
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden', // Keeps curtain inside
            color: 'var(--text-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            
            {/* 🌸 BACKGROUND FLOWERS 🌸 */}
            <FlowerGarden />

            {/* 🎵 AUDIO PLAYER (Hidden) 🎵 */}
            {/* REPLACE '/song.mp3' with your actual music file in the public folder */}
            <audio ref={audioRef} loop>
                <source src="/song.mp3" type="audio/mpeg" />
            </audio>

            {/* 🌗 THEME TOGGLE (Top Right) 🌗 */}
            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50 }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
                <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
            </div>

            {/* 🎭 THE CURTAIN (Slides Up) 🎭 */}
            <div 
                className={`curtain ${curtainOpen ? 'open' : ''}`} 
                onClick={handleCurtainClick}
            >
                <div className="curtain-content">
                    <h1>🎉 A Surprise Awaits! 🎉</h1>
                    <p>Click to Reveal</p>
                    <div className="bounce-arrow">⬆️</div>
                </div>
            </div>

            {/* 💌 MAIN CONTENT (The Note & Photo) 💌 */}
            <div className="card birthday-card">
                <h1>🎉 Happy Birthday, My Love! 🎉</h1>
                
                {/* PHOTO SECTION */}
                <div className="photo-frame">
    {/* Make sure the slash / is there! */}
    <img src="/us.jpg" alt="Us" />
</div>

                {/* NOTE SECTION */}
                <div className="note-content">
                    <p>
                        To my favorite person in the world, <br/><br/>
                        I hope you enjoyed this little countdown! You make every day brighter 
                        just by being you. I can't wait to celebrate with you today.
                        <br/><br/>
                        P.S. You can click on the background to plant flowers for me! 🌸
                    </p>
                </div>
                
                <p className="signature">With all my love, <br/> <strong>Prem</strong> ❤️</p>
            </div>

            {/* 🔄 RESET BUTTON (Bottom Right) 🔄 */}
            <button 
                onClick={() => {
                    if(window.confirm("Reset the app to Day 1?")) {
                        localStorage.clear();
                        window.location.reload();
                    }
                }}
                className="reset-btn"
            >
                🔄 Reset
            </button>
        </div>
    );
};

export default BirthdayReveal;