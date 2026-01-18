import React, { useState, useEffect } from 'react';
import './App.css';
import BirthdayReveal from './BirthdayReveal';
import FlowerGarden from './FlowerGarden';
import NumberLock from './NumberLock'; // 🔐 IMPORT THE NEW COMPONENT

// --- 🔒 CONFIGURATION ---
// The Fixed Birthday Date
const TARGET_DATE = new Date("2026-01-18T00:00:00"); 

// --- 📜 QUEST DATA ---
const quests = [
    { 
      id: 1, 
      question: "Let's go back to the start. This is something we completed together for the very first time. You started it, and I finished it, sparking the first words between us.", 
      answer: "butterfly", 
      hint: "Check your memory of your EG notebook.", 
      reward: "Flutter by! A beautiful butterfly is waiting for you in your bag right now. 🦋" 
    },
    { 
      id: 2, 
      question: "Names have power, but nicknames have love. Do you remember the very first nickname I ever gave you?", 
      answer: "jerry", 
      hint: "It has a double 'rr' in it.",
      reward: "You caught me! A set of Tom & Jerry stickers is waiting for you with your babhi. 🐭🐱" 
    },
    // 🔐 QUEST 3 IS NOW A NUMBER LOCK PUZZLE
    { 
      id: 3, 
      type: 'lock', // ⚠️ SPECIAL MARKER FOR LOCK UI
      question: "Unlock the memory: Enter the date (DDMM) of the first time we ever played 'Red Hands' together.", 
      answer: "2007", // 🔢 CHANGE THIS TO YOUR SECRET NUMBER
      hint: "in the month of rains 🌧️",
      reward: "Access Granted! Reward: You got a cashprise of 2007 INR! 💸" 
    },
    { 
      id: 4, 
      question: "A test of endurance and company. How long exactly did we sit together when we went to the movies for the first time?", 
      answer: "3h 17m", 
      hint: "Think 'Avatar'. Format: XH XM",
      reward: "That's a lot of popcorn! Reward: One Free Movie Night ticket for your favorite film! and popcorn in on me😉🍿🎟️" 
    },
    { 
      id: 5, 
      question: "Food tastes better with you. What was the very first item (or items) we ordered when we hung out at the movie-themed cafe?", 
      answer: "dragon chicken"||"chicken roll"||"chocolate ice cream", 
      hint: "Think spicy and sweet.",
      reward: "Yum! Reward: A 'Dinner Date Coupon' is yours. Dress code: Gorgeous. 🍽️🍷" 
    },
    { 
      id: 6, 
      question: "Sweets for the sweet. What was the specific name of the very first chocolate you ever bought for me?", 
      answer: "dairy milk oreo", 
      hint: "It's a classic Cadbury flavor",
      reward: "Sweet tooth satisfied! Reward: A real chocolate is coming your way! 🍫" 
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
  // --- STATE ---
  const [username, setUsername] = useState(localStorage.getItem('user_name') || '');
  const [daysLeft, setDaysLeft] = useState(0);
  const [view, setView] = useState('loading'); // 'loading', 'login', 'countdown', 'birthday'
  
  // Quest Logic State
  const [activeQuest, setActiveQuest] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showReward, setShowReward] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');

  // --- 1. TIME CALCULATION ENGINE (Local) ---
  useEffect(() => {
    const timer = setInterval(() => {
        const today = new Date();
        
        // Calculate difference
        const diffTime = TARGET_DATE - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            setView('birthday');
        } else {
            setDaysLeft(diffDays);
            // If we have a username, show countdown. If not, show login.
            setView(prev => prev === 'birthday' ? 'birthday' : (username ? 'countdown' : 'login'));
        }
    }, 1000); // Check every second

    return () => clearInterval(timer);
  }, [username]);

  // --- 2. THEME LOGIC ---
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // --- 3. HANDLERS ---
  const handleLogin = (name) => {
    if (!name.trim()) return;
    localStorage.setItem('user_name', name);
    setUsername(name);
    setView('countdown');
  };

  // ✅ SHARED HELPER: UNLOCKS THE REWARD
  const completeQuest = () => {
      localStorage.setItem(`quest_${activeQuest.id}`, 'true');
      setShowReward(activeQuest.reward);
      setActiveQuest(null);
      setInputAnswer("");
      setShowHint(false);
  };

  // HANDLER FOR TEXT QUESTS
  const checkAnswer = () => {
    if (inputAnswer.trim().toLowerCase() === activeQuest.answer.toLowerCase()) {
        completeQuest(); // Call the helper
    } else {
        alert("Try again! ❌");
    }
  };

  // Helper to get readable date for locked cards
  const getUnlockDateString = (dayLevel) => {
      const date = new Date(TARGET_DATE);
      date.setDate(TARGET_DATE.getDate() - (8 - dayLevel));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- RENDER HELPERS ---
  
  // A. LOADING
  if (view === 'loading') return <div className="loading">Checking timeline...</div>;

  // B. BIRTHDAY REVEAL
  if (view === 'birthday') return <BirthdayReveal />;

  // C. LOGIN SCREEN (Replaces Date Picker)
  if (!username) {
    return (
        <div className="app-container intro-screen">
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

  // D. COUNTDOWN & QUESTS
  return (
    <div className="app-container">
      <FlowerGarden />
      
      {/* THEME TOGGLE */}
      <div className="theme-toggle">
        <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️</button>
        <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻</button>
        <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙</button>
      </div>

      <h1>🎂 {daysLeft} Days to Go, {username}! 🎂</h1>
      <p className="subtitle">Target: {TARGET_DATE.toDateString()}</p>
      
      <div className="quest-grid">
        {quests.map((q, index) => {
            const level = index + 1;
            
            // LOGIC: Unlock calculation
            // Day 1 unlocks 7 days before, Day 7 unlocks 1 day before
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

      {/* --- MODAL RENDERING LOGIC --- */}
      {activeQuest && (
          // 1. CHECK IF IT IS A LOCK PUZZLE
          activeQuest.type === 'lock' ? (
              <NumberLock 
                  targetCode={activeQuest.answer}
                  hint={activeQuest.hint}
                  onUnlock={completeQuest} 
                  onClose={() => setActiveQuest(null)} 
              />
          ) : (
              // 2. OTHERWISE, RENDER STANDARD TEXT MODAL
              <div className="modal">
                  <div className="modal-content">
                      <h2>Day {activeQuest.id}</h2>
                      <p>{activeQuest.question}</p>
                      <input value={inputAnswer} onChange={e => setInputAnswer(e.target.value)} className="answer-input" placeholder="Type answer..." />
                      
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

      {/* REWARD MODAL */}
      {showReward && (
          <div className="modal reward-overlay">
             <div className="modal-content reward-card bounce">
                 <h2>🎉 Quest Complete!</h2>
                 <p>{showReward}</p>
                 <button className="btn-claim" onClick={() => setShowReward(null)}>Close</button>
             </div>
          </div>
      )}
      
      {/* NO RESET BUTTON */}
    </div>
  );
}

export default App;