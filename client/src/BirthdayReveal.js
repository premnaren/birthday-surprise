import React, { useState, useEffect, useRef } from 'react';
import FlowerGarden from './FlowerGarden';
import './App.css'; 

// 📸 CONFIGURATION: Add your photo filenames here!
// (Make sure these files are in your 'public' folder)
const PHOTOS = [
    "/pic1.jpg", 
    "/pic2.jpg", 
    "/pic3.jpg", 
    "/pic4.jpg",
    "/pic5.jpg" 
];

const BirthdayReveal = () => {
    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    
    // 🎡 CAROUSEL STATE (New)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    
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

    // --- 2. ROTATING WHEEL LOGIC (New) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
        }, 3000); // Change photo every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // --- 3. MUSIC CONTROL ---
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
            <div style={{zIndex: 0}}><FlowerGarden /></div>

            {/* 🎵 AUDIO PLAYER 🎵 */}
            <audio ref={audioRef} loop>
                <source src="/song.mp3" type="audio/mpeg" />
            </audio>

            {/* 🌗 THEME TOGGLE 🌗 */}
            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
                <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
            </div>

            {/* 🎭 THE CURTAIN 🎭 */}
            <div 
                className={`curtain ${curtainOpen ? 'open' : ''}`} 
                onClick={handleCurtainClick}
                style={{zIndex: 200}}
            >
                <div className="curtain-content">
                    <h1>🎉 A Surprise Awaits! 🎉</h1>
                    <p>Click to Reveal</p>
                    <div className="bounce-arrow">⬆️</div>
                </div>
            </div>

            {/* 💌 MAIN CONTENT CARD 💌 */}
            <div className="birthday-card" style={{zIndex: 10}}>
                <h1 className="bday-title">🎉 Happy Birthday! 🎉</h1>
                
                {/* 🎡 THE 3D PHOTO WHEEL (Replaces single image) 🎡 */}
                <div className="scene">
                    <div className="carousel">
                        {PHOTOS.map((photo, index) => {
                            // Determine position of each card
                            let className = "carousel-item";
                            if (index === currentPhotoIndex) className += " active";
                            else if (index === (currentPhotoIndex - 1 + PHOTOS.length) % PHOTOS.length) className += " prev";
                            else if (index === (currentPhotoIndex + 1) % PHOTOS.length) className += " next";
                            else className += " hidden"; 

                            return (
                                <div key={index} className={className}>
                                    <img src={photo} alt="Memory" className="photo-frame-3d" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- THE INTERACTIVE NOTE --- */}
                <div className="note-section">
                    {!noteOpen ? (
                        <div className="folded-note" onClick={() => setNoteOpen(true)}>
                            <div className="heart-seal">❤️</div>
                            <p>Read My Letter</p>
                        </div>
                    ) : (
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
                style={{zIndex: 100}}
            >
                🔄 Reset
            </button>
        </div>
    );
};

export default BirthdayReveal;