// client/src/BirthdayReveal.js
import React, { useState, useRef } from 'react';
import './BirthdayReveal.css';

function BirthdayReveal() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLetter, setShowLetter] = useState(false);
    
    // Audio ref to handle music
    const audioRef = useRef(null);

    const handleOpenCurtain = () => {
        setIsOpen(true);
        // Try to play music when user clicks (browsers block autoplay)
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
    };

    return (
        <div className="reveal-container">
            {/* 0. HIDDEN AUDIO PLAYER */}
            {/* Put your song.mp3 in the 'public' folder of your react app */}
            <audio ref={audioRef} loop>
                <source src="/song.mp3" type="audio/mpeg" />
            </audio>

            {/* 1. THE CURTAIN LAYER */}
            <div className={`curtain-container ${isOpen ? 'curtain-open' : ''}`}>
                <h1 className="curtain-text">Happy<br/>Birthday!</h1>
                <button className="btn-open-curtain" onClick={handleOpenCurtain}>
                    Tap to Open 🎁
                </button>
            </div>

            {/* 2. THE MAIN PHOTO REVEAL */}
            {/* Only clickable after curtain opens */}
            <div className="photo-frame" onClick={() => isOpen && setShowLetter(true)}>
                {/* --- REPLACE WITH HER PHOTO URL --- */}
                <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Birthday Girl" 
                    className="photo-img" 
                />
                
                <div className="caption">
                    <h2>My Love ❤️</h2>
                    <p className="click-hint">(Tap the photo!)</p>
                </div>
            </div>

            {/* 3. THE FINAL LETTER */}
            {showLetter && (
                <div className="letter-overlay">
                    <div className="letter-card">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/4213/4213642.png" 
                            alt="Cute Bear" 
                            className="cute-sticker"
                        />
                        <h3>To my favorite person,</h3>
                        <p className="letter-body">
                            Happy Birthday! 🎉<br/><br/>
                            You are the best thing that ever happened to me. 
                            I hope today brings you as much joy as you bring into my life.
                            <br/><br/>
                            Let's celebrate! 🎂
                        </p>
                        <button className="btn-close" onClick={() => setShowLetter(false)}>
                            Close ❤️
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BirthdayReveal;