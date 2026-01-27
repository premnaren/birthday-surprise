import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti'; 
import './App.css';
import BirthdayReveal from './BirthdayReveal';
import NumberLock from './NumberLock'; 
import Fireflies from './Fireflies'; 

// --- 🔒 CONFIGURATION ---
const TARGET_DATE = new Date("2026-02-07T00:00:00"); 

// --- 📜 QUEST DATA ---
const quests = [
    { 
      id: 1, 
      question: "Names have power, but nicknames have love. Do you remember the very first nickname I ever gave you?", 
      answer: "jerry", 
      hint: "It has a double 'rr' in it.", 
      reward: "You caught me! A set of Tom & Jerry stickers is waiting for you with your babhi. 🐭🐱" 
    },
    { 
     id: 2, 
      question: "A test of endurance and company. How long exactly did we sit together when we went to the movies for the first time?", 
      answer: "3h 17m", 
      hint: "Think 'Avatar'. Format: XH XM",
      reward: "That's a lot of popcorn! Reward: One Free Movie Night ticket for your favorite film! and popcorn in on me😉🍿🎟️",
      rewardImage: "/movie-ticket.png" 
    },
    { 
      id: 3, 
      type: 'lock', 
      question: "Unlock the memory: Enter the date (DDMM) of the first time we ever played 'Red Hands' together.", 
      answer: "2007", 
      hint: "Unlock the memory: Enter the date (DDMM) of the first time we ever played 'Red Hands' together.",
      reward: "Access Granted! Reward: You got a cashprise of 2007 INR! 💸" 
    },
    { 
      id: 4, 
      question: "Let's go back to the start. This is something we completed together for the very first time. You started it, and I finished it, sparking the first words between us.", 
      answer: "butterfly", 
      hint: "Check your memory of your notebook of first sem.",
      reward: "Flutter by! A beautiful butterfly is waiting for you in your bag right now. 🦋",
    },
    { 
      id: 5, 
      question: "Sweets for the sweet. What was the specific name of the very first chocolate you ever bought for me?", 
      answer: "dairy milk oreo", 
      hint: "It's a classic Cadbury flavor",
      reward: "Sweet tooth satisfied! Reward: A real chocolate is coming your way! 🍫" 
    },
    { 
      id: 6, 
      question: "Food tastes better with you. What was the very first item we ordered when we hung out at the movie-themed cafe?", 
      answer: ["dragon chicken", "chicken roll", "chocolate ice cream"], 
      hint: "Think spicy and sweet.",
      reward: "Yum! Reward: A 'Dinner Date Coupon' is yours. Dress code: Gorgeous. 🍽️🍷",
      rewardImage: "/dinner-ticket.png" 
    },
    { 
      id: 7, 
      question: "Final Step: Just type 'Open' to unlock my heart.", 
      answer: "open", 
      hint: "Opposite of Close. 🔓",
      reward: "You did it! Get ready for the big surprise tomorrow... ❤️" 
    }
];

function App() {
  const [username, setUsername] = useState(localStorage.getItem('user_name') || '');
  const [daysLeft, setDaysLeft] = useState(0);
  const [view, setView] = useState('loading'); 
  
  const [activeQuest, setActiveQuest] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showReward, setShowReward] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // 🎵 MUSIC STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const completedCount = quests.filter(q => localStorage.getItem(`quest_${q.id}`) === 'true').length;
  const progressPercent = (completedCount / quests.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
        const today = new Date();
        const diffTime = TARGET_DATE - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            setView('birthday');
        } else {
            setDaysLeft(diffDays);
            setView(prev => prev === 'birthday' ? 'birthday' : (username ? 'countdown' : 'login'));
        }
    }, 1000); 
    return () => clearInterval(timer);
  }, [username]);

  // 🎵 TOGGLE MUSIC FUNCTION
  const toggleMusic = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    }
  };

  /* 👇👇 INSERT THIS NEW BLOCK HERE 👇👇 */
  useEffect(() => {
    const timer = setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Auto-play blocked until interaction:", e));
        }
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, []);
  /* 👆👆 END OF NEW BLOCK 👆👆 */

  const handleLogin = (name) => {
    if (!name.trim()) return;
    localStorage.setItem('user_name', name);
    setUsername(name);
    setView('countdown');
  };

  const completeQuest = () => {
      localStorage.setItem(`quest_${activeQuest.id}`, 'true');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffffff', '#ff4d6d'] 
      });

      setShowReward(activeQuest.reward);
      setActiveQuest(null);
      setInputAnswer("");
      setShowHint(false);
  };

  const checkAnswer = () => {
    const userAnswer = inputAnswer.trim().toLowerCase();
    const correct = activeQuest.answer;
    let isCorrect = false;

    if (Array.isArray(correct)) {
        isCorrect = correct.some(ans => ans.toLowerCase() === userAnswer);
    } else {
        isCorrect = userAnswer === correct.toLowerCase();
    }

    if (isCorrect) {
        completeQuest(); 
    } else {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    }
  };

  const getUnlockDateString = (dayLevel) => {
      const date = new Date(TARGET_DATE);
      date.setDate(TARGET_DATE.getDate() - (8 - dayLevel));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

if (view === 'loading') return (
      <div className="app-container midnight-theme loading-screen">
          <h1> agara bujji...</h1>
      </div>
  );  
  if (view === 'birthday') return <BirthdayReveal />;
  
  if (!username) {
    return (
        /* 👇 ADDED "midnight-theme" HERE 👇 */
        <div className="app-container intro-screen midnight-theme">
            <div className="card intro-card fade-in">
                <h1>👋 Welcome!</h1>
                <p>I have a surprise for you.</p>
                <p>First, what is your nickname?</p>
                <input 
                    type="text" 
                    placeholder="Enter nickname..." 
                    id="nameInput"
                    className="name-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin(e.target.value)}
                />
                <button className="btn-submit" onClick={() => handleLogin(document.getElementById('nameInput').value)}>Enter ➡️</button>
            </div>
        </div>
    );
  }

  return (
    <div className="app-container midnight-theme">
      
      {/* ✨ FIREFLIES BACKGROUND */}
      <Fireflies />

      {/* 🎵 MUSIC PLAYER */}
      <audio ref={audioRef} loop><source src="/quest-song.mp3" /></audio>
      
      <div className="music-control" onClick={toggleMusic} style={{ zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', fontSize: '2rem', cursor: 'pointer' }}>
          {isPlaying ? '⏸️' : '▶️'}
      </div>
      
      <h1>🌙 {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} to Go, {username}! 🌙</h1>
      
      <div className="progress-container">
        <div className="progress-label" style={{color: '#ffd700'}}>
            <span>Journey Progress</span>
            <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%`, background: '#ffd700' }}></div>
        </div>
      </div>

      <p className="subtitle" style={{color: '#ccc'}}>Target: {TARGET_DATE.toDateString()}</p>
      
      <div className="quest-grid">
        {quests.map((q, index) => {
            const level = index + 1;
            const unlockDate = new Date(TARGET_DATE);
            unlockDate.setDate(TARGET_DATE.getDate() - (8 - level));
            unlockDate.setHours(0,0,0,0);
            const now = new Date();
            now.setHours(0,0,0,0);
            
            const isUnlocked = now >= unlockDate;
            const isCompleted = localStorage.getItem(`quest_${q.id}`) === 'true';

            return (
                <div 
                    key={q.id} 
                    className={`card ${isCompleted ? 'done' : (isUnlocked ? 'unlocked' : 'locked')}`}
                    onClick={() => {
                        if (isUnlocked && !isCompleted) setActiveQuest(q);
                    }}
                >
                    <div className="day-badge">Day {level}</div>
                    <div className="status-icon">
                        {isCompleted ? "✅" : (isUnlocked ? "🔓" : "🔒")}
                    </div>
                    {!isUnlocked && (
                        <div className="locked-tooltip">
                            Unlocks {getUnlockDateString(level)} 🔒
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {activeQuest && (
          activeQuest.type === 'lock' ? (
              <NumberLock 
                  targetCode={activeQuest.answer}
                  hint={activeQuest.hint}
                  onUnlock={completeQuest} 
                  onClose={() => setActiveQuest(null)} 
              />
          ) : (
              <div className="modal">
                  <div className="modal-content" style={{color: '#333'}}>
                      <h2>Day {activeQuest.id}</h2>
                      <p>{activeQuest.question}</p>
                      
                      <input 
                        value={inputAnswer} 
                        onChange={e => setInputAnswer(e.target.value)} 
                        className={`answer-input ${isShaking ? "shake" : ""}`} 
                        placeholder="Type answer..." 
                      />
                      
                      {isShaking && <p className="error-text">❌ Incorrect, try again!</p>}

                      <div className="button-group">
                        <button className="btn-hint-toggle" onClick={() => setShowHint(!showHint)}>
                            {showHint ? "Hide Hint" : "💡 Hint"}
                        </button>
                        <button className="btn-submit" onClick={checkAnswer}>Submit</button>
                      </div>
                      {showHint && <p className="hint-text fade-in">{activeQuest.hint}</p>}
                      <button className="btn-close" onClick={() => {
                          setActiveQuest(null);
                          setShowHint(false);
                          setInputAnswer("");
                      }}>Cancel</button>
                  </div>
              </div>
          )
      )}

      {showReward && (
          <div className="modal reward-overlay">
             <div className="modal-content reward-card bounce" style={{color: '#333'}}>
                 <h2>🎉 Quest Complete!</h2>
                 {quests.find(q => q.reward === showReward)?.rewardImage && (
                    <img 
                        src={quests.find(q => q.reward === showReward).rewardImage} 
                        alt="Reward Coupon" 
                        style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} 
                    />
                 )}
                 <p>{showReward}</p>
                 <button className="btn-claim" onClick={() => setShowReward(null)}>Close</button>
             </div>
          </div>
      )}
    </div>
  );
}

export default App;