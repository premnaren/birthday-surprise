import React, { useState, useEffect, useRef } from 'react';
import FlowerGarden from './FlowerGarden';
import couplePhoto from './couple.jpg'; // Importing the photo directly!
import './App.css'; 

const BirthdayReveal = () => {
    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false); // <--- NEW STATE FOR NOTE
    const audioRef = useRef(null);

    // --- THEME LOGIC ---
    useEffect(() => {
        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark);

        if (isDark) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    // --- MUSIC CONTROL ---
    const handleCurtainClick = () => {
        setCurtainOpen(true);
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    return (
        <div className="birthday-container" style={{ 
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            color: 'var(--text-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            
            {/* 🌸 BACKGROUND FLOWERS 🌸 */}
            <FlowerGarden />

            {/* 🎵 AUDIO PLAYER 🎵 */}
            <audio ref={audioRef} loop>
                <source src="/song.mp3" type="audio/mpeg" />
            </audio>

            {/* 🌗 THEME TOGGLE 🌗 */}
            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50 }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
                <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
            </div>

            {/* 🎭 THE CURTAIN 🎭 */}
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

            {/* 💌 MAIN CONTENT 💌 */}
            <div className="birthday-card">
                <h1>🎉 Happy Birthday, My Love! 🎉</h1>
                
                {/* PHOTO SECTION */}
                <div className="photo-frame">
                    <img src={couplePhoto} alt="Us" />
                </div>

                {/* --- THE INTERACTIVE NOTE --- */}
                <div className="note-section">
                    {!noteOpen ? (
                        // 1. CLOSED STATE (The Envelope)
                        <div className="folded-note" onClick={() => setNoteOpen(true)}>
                            <div className="heart-seal">❤️</div>
                            <p>Read My Letter</p>
                        </div>
                    ) : (
                        // 2. OPEN STATE (The Notebook Paper)
                        <div className="note-content open" onClick={() => setNoteOpen(false)}>
                            <p>
                                To my favorite person in the world, <br/><br/>
                                I hope you enjoyed this little countdown! You make every day brighter 
                                just by being you. I can't wait to celebrate with you today.
                                <br/><br/>
                                P.S. You can click on the background to plant flowers for me! 🌸
                            </p>
                            <p className="signature">With all my love, <br/> <strong>Prem</strong> ❤️</p>
                            <span className="close-hint">(Click to close)</span>
                        </div>
                    )}
                </div>

            </div>

            {/* 🔄 RESET BUTTON 🔄 */}
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