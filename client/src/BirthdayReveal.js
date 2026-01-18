import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti'; 
import './App.css'; 
import BalloonSky from './BalloonSky'; 

// 📸 CONFIGURATION 1: PHOTOS
const MEMORIES = [
    { img: "/pic1.jpeg", text: "Naa bangaru konda ❤️" },
    { img: "/pic2.jpeg", text: "pottoda😁" },
    { img: "/pic3.jpeg", text: "💕😍" },
    { img: "/pic4.jpeg", text: "Forever Us" },
    { img: "/pic5.jpeg", text: "Happy Birthday Raa" }
];

// 💌 CONFIGURATION 2: YOUR LETTER (Write whatever you want here!)
const LETTER_MESSAGE = `
 To my Dearest Love,

Happy Birthday Nanna! From the moment we met everything happened is a memory. 
Neetho gadipini prathi nimisham naa hrudayam lo oka special place ni tecchindi. All the laughter, the late-night talks, caring each other, fighting and fixing them - they are treasures I hold close to my heart.
ee life ki inka nuvve le. nuv madyalo em raledhu nuv ravatame oka anandam.
inka yevaru vachina ninnu replace cheyaleru so asala dhani gurinchi alochinchaku.
I look forward to creating many more beautiful memories with you. May this year bring you endless joy, success, and all the love you deserve.
inka chala undhi kani matalo chepaleka pothunna so kudirithe umma esta le.

Once again Happy Birthday, Kanna! ❤️
`;

const START_DATE = "2023-11-13"; 

const BirthdayReveal = () => {
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');
    const [curtainOpen, setCurtainOpen] = useState(false);
    
    // Note & Typewriter State
    const [noteOpen, setNoteOpen] = useState(false);
    const [typedText, setTypedText] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0); 
    const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [candles, setCandles] = useState([true, true, true, true, true]); 
    const [wished, setWished] = useState(false);
    
    // Music State
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

    // ⌨️ TYPEWRITER EFFECT LOGIC
    useEffect(() => {
        if (noteOpen) {
            let i = 0;
            setTypedText(""); // Reset text
            const typingInterval = setInterval(() => {
                if (i < LETTER_MESSAGE.length) {
                    setTypedText(prev => prev + LETTER_MESSAGE.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50); // Speed: 50ms per letter
            return () => clearInterval(typingInterval);
        }
    }, [noteOpen]);

    const handleCurtainClick = () => {
        setCurtainOpen(true);
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log(e));
            setIsPlaying(true); 
        }
    };

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

            {/* 🎵 SPINNING PHOTO FROM LAPTOP */}
            <div className="music-control" onClick={toggleMusic} style={{ zIndex: 1000 }}>
                <img 
                    src="/my-pic.jpg" 
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
                    
                    {/* 💌 UPDATED NOTE SECTION */}
                    <div className="note-section">
                        {!noteOpen ? (
                            <div className="folded-note" onClick={() => setNoteOpen(true)}>
                                <div className="heart-seal">❤️</div>
                                <p>Read Letter</p>
                            </div>
                        ) : (
                            <div className="note-content open" onClick={() => setNoteOpen(false)}>
                                {/* This displays the Typewriter text with line breaks */}
                                <p style={{ whiteSpace: 'pre-line' }}>{typedText}</p>
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