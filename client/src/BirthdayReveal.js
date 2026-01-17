import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti'; 
import './App.css'; 
// 🎈 IMPORT BALLOONS (Make sure BalloonSky.js exists!)
import BalloonSky from './BalloonSky'; 

const MEMORIES = [
    { img: "/pic1.jpg", text: "My Love ❤️" },
    { img: "/pic2.jpg", text: "Best Day Ever" },
    { img: "/pic3.jpg", text: "Crazy Times 🤪" },
    { img: "/pic4.jpg", text: "Our Trip ✈️" },
    { img: "/pic5.jpg", text: "Forever Us" }
];

const START_DATE = "2023-11-13"; 

const BirthdayReveal = () => {
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [candles, setCandles] = useState([true, true, true, true, true]); 
    const [wished, setWished] = useState(false);
    
    // 🎵 MUSIC STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Theme Logic
    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    // Timer Logic
    useEffect(() => {
        const interval = setInterval(() => {
            const start = new Date(START_DATE);
            const now = new Date();
            const diff = now - start;
            setTime({
                years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365)),
                days: Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Carousel Logic
    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex((p) => (p + 1) % MEMORIES.length), 3500);
        return () => clearInterval(interval);
    }, []);

    // 🎵 UPDATED: Starts music + spinning state
    const handleCurtainClick = () => {
        setCurtainOpen(true);
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log(e));
            setIsPlaying(true); 
        }
    };

    // 🎵 NEW: Toggles music on/off
    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const blowCandle = (index, e) => {
        e.stopPropagation(); 
        const newCandles = [...candles];
        newCandles[index] = false; 
        setCandles(newCandles);
        if (newCandles.every(c => c === false) && !wished) {
            setWished(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    return (
        <div className="birthday-container">
            <div style={{zIndex: 0}}><BalloonSky /></div>

            <audio ref={audioRef} loop><source src="/song.mp3" /></audio>

            {/* 🎵 SPINNING RANDOM PIC (Click to Toggle) */}
            <div className="music-control" onClick={toggleMusic} style={{ zIndex: 1000 }}>
                <img 
                    src="data:image/jpeg;base64,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"  /* <--- CHANGED TO RANDOM IMAGE */
                    alt="Music Toggle" 
                    className={`music-icon ${isPlaying ? 'spinning' : ''}`} 
                />
            </div>

            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
                <button onClick={() => setTheme('light')}>☀️</button>
                <button onClick={() => setTheme('dark')}>🌙</button>
            </div>

            <div className={`curtain ${curtainOpen ? 'open' : ''}`} onClick={handleCurtainClick} style={{zIndex: 200}}>
                <div className="curtain-content">
                    <h1>🎉 A Surprise Awaits! 🎉</h1>
                    <p>Click to Reveal</p>
                </div>
            </div>

            <div className="split-layout" style={{zIndex: 10}}>
                
                {/* LEFT: MEMORIES */}
                <div className="left-zone">
                    <h1 className="bday-title">Happy Birthday!</h1>
                    <div className="polaroid-stack">
                        {MEMORIES.map((memory, index) => {
                            let className = "polaroid-card";
                            if (index === currentIndex) className += " active";
                            else if (index === (currentIndex - 1 + MEMORIES.length) % MEMORIES.length) className += " prev";
                            else if (index === (currentIndex + 1) % MEMORIES.length) className += " next";
                            else className += " hidden"; 
                            return (
                                <div key={index} className={className}>
                                    <div className="polaroid-inner"><img src={memory.img} alt="Memory" /></div>
                                    <div className="polaroid-caption">{memory.text}</div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="note-section">
                        {!noteOpen ? (
                            <div className="folded-note" onClick={() => setNoteOpen(true)}>
                                <div className="heart-seal">❤️</div>
                                <p>Read Letter</p>
                            </div>
                        ) : (
                            <div className="note-content open" onClick={() => setNoteOpen(false)}>
                                <p>To my love...<br/>(Write your letter here)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: CLOCK & CAKE */}
                <div className="right-zone">
                    <div className="live-clock-container">
                        <h3>❤️ Together For:</h3>
                        <div className="time-grid">
                            <div className="time-box"><span>{time.years}</span><small>Yrs</small></div>
                            <div className="time-box"><span>{time.days}</span><small>Days</small></div>
                            <div className="time-box"><span>{time.hours}</span><small>Hrs</small></div>
                            <div className="time-box"><span>{time.minutes}</span><small>Min</small></div>
                            <div className="time-box"><span>{time.seconds}</span><small>Sec</small></div>
                        </div>
                    </div>

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
                                    <div key={i} className="candle" onClick={(e) => blowCandle(i, e)}>
                                        <div className={`flame ${isLit ? 'lit' : 'out'}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthdayReveal;