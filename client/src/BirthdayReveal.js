import React, { useState, useEffect, useRef } from 'react';
import FlowerGarden from './FlowerGarden';
import confetti from 'canvas-confetti'; 
import './App.css'; 

// 📸 CONFIGURATION
const PHOTOS = [
    "/pic1.jpg", "/pic2.jpg", "/pic3.jpg", "/pic4.jpg", "/pic5.jpg" 
];
// 📅 START DATE (For the Clock)
const START_DATE = "2022-10-16"; 

// --- ⏳ SUB-COMPONENT: LIVE CLOCK ---
const LiveClock = () => {
    const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const start = new Date(START_DATE);
            const now = new Date();
            const diff = now - start;

            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTime({ years, days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="live-clock-container">
            <h3>❤️ We've been together for:</h3>
            <div className="time-grid">
                <div className="time-box"><span>{time.years}</span><small>Years</small></div>
                <div className="time-box"><span>{time.days}</span><small>Days</small></div>
                <div className="time-box"><span>{time.hours}</span><small>Hrs</small></div>
                <div className="time-box"><span>{time.minutes}</span><small>Mins</small></div>
                <div className="time-box"><span>{time.seconds}</span><small>Secs</small></div>
            </div>
        </div>
    );
};

// --- 🎂 SUB-COMPONENT: INTERACTIVE CAKE ---
const BirthdayCake = () => {
    const [candles, setCandles] = useState([true, true, true, true, true]); 
    const [wished, setWished] = useState(false);

    // --- FIX APPLIED HERE ---
    // We now accept 'e' (the event data) and stop it from bubbling up.
    const blowCandle = (index, e) => {
        e.stopPropagation(); // <--- STOP THE FLOWERS! 🛑

        // Only proceed if the candle is currently lit
        if (candles[index]) {
            const newCandles = [...candles];
            newCandles[index] = false; 
            setCandles(newCandles);

            // Check if all are out
            if (newCandles.every(c => c === false) && !wished) {
                setWished(true);
                triggerBigExplosion();
            }
        }
    };

    const triggerBigExplosion = () => {
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    return (
        // Added stopPropagation to container too, just in case clicks miss the candle slightly
        <div className="cake-container" onClick={(e) => e.stopPropagation()}>
            <h3>{wished ? "🎉 YAY! Make a Wish! 🎉" : "🎂 Blow out the candles!"}</h3>
            <div className="cake">
                <div className="plate"></div>
                <div className="layer layer-bottom"></div>
                <div className="layer layer-middle"></div>
                <div className="layer layer-top"></div>
                <div className="icing"></div>
                <div className="candles">
                    {candles.map((isLit, i) => (
                        // Updated onClick to pass 'e'
                        <div key={i} className="candle" onClick={(e) => blowCandle(i, e)}>
                            <div className={`flame ${isLit ? 'lit' : 'out'}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 🏠 MAIN COMPONENT ---
const BirthdayReveal = () => {
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const audioRef = useRef(null);

    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex((p) => (p + 1) % PHOTOS.length), 3500);
        return () => clearInterval(interval);
    }, []);

    const handleCurtainClick = () => {
        setCurtainOpen(true);
        if (audioRef.current) audioRef.current.play().catch(e => console.log(e));
    };

    return (
        <div className="birthday-container">
            <div style={{zIndex: 0}}><FlowerGarden /></div>
            <audio ref={audioRef} loop><source src="/song.mp3" /></audio>

            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
                <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
            </div>

            <div className={`curtain ${curtainOpen ? 'open' : ''}`} onClick={handleCurtainClick} style={{zIndex: 200}}>
                <div className="curtain-content">
                    <h1>🎉 A Surprise Awaits! 🎉</h1>
                    <p>Click to Reveal</p>
                    <div className="bounce-arrow">⬆️</div>
                </div>
            </div>

            <div className="split-layout" style={{zIndex: 10}}>
                
                {/* LEFT SIDE */}
                <div className="left-zone">
                    <h1 className="bday-title">Happy Birthday!</h1>
                    <div className="polaroid-stack">
                        {PHOTOS.map((photo, index) => {
                            let className = "polaroid-card";
                            if (index === currentIndex) className += " active";
                            else if (index === (currentIndex - 1 + PHOTOS.length) % PHOTOS.length) className += " prev";
                            else if (index === (currentIndex + 1) % PHOTOS.length) className += " next";
                            else className += " hidden"; 
                            return (
                                <div key={index} className={className}>
                                    <div className="polaroid-inner"><img src={photo} alt="Memory" /></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="note-section">
                        {!noteOpen ? (
                            <div className="folded-note" onClick={() => setNoteOpen(true)}>
                                <div className="heart-seal">❤️</div>
                                <p>Read My Letter</p>
                            </div>
                        ) : (
                            <div className="note-content open" onClick={() => setNoteOpen(false)}>
                                <p>To my favorite person... <br/><br/>(Your letter text here)</p>
                                <p className="signature">Love, <br/> <strong>Prem</strong> ❤️</p>
                                <span className="close-hint">(Click to close)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="right-zone">
                    <LiveClock />
                    <div className="spacer"></div>
                    <BirthdayCake />
                </div>
            </div>
            
            <button onClick={() => { if(window.confirm("Reset?")) { localStorage.clear(); window.location.reload(); }}} className="reset-btn" style={{zIndex: 100}}>
                🔄 Reset
            </button>
        </div>
    );
};

export default BirthdayReveal;