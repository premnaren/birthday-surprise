import React, { useState, useEffect } from 'react';
import './App.css';
import BirthdayReveal from './BirthdayReveal';
import FlowerGarden from './FlowerGarden';

// --- 🔒 CONFIGURATION ---
// The Fixed Birthday Date
const TARGET_DATE = new Date("2026-01-17T00:00:00"); 

// --- 📜 QUEST DATA ---
const quests = [
    { 
      id: 1, 
      question: "Let's start easy. Where did we go for our very first date?", 
      answer: "coffee", 
      hint: "It involves beans and milk! ☕", 
      reward: "Yay! I transferred ₹500 to your GPay. Go buy yourself a treat! ☕" 
    },
    { 
      id: 2, 
      question: "What is the name of the first movie we watched together?", 
      answer: "avengers", 
      hint: "It has Iron Man and Thor in it. 🦸‍♂️",
      reward: "Correct! Reward: A Coupon for '1 Free Back Massage' from me! 💆‍♀️" 
    },
    { 
      id: 3, 
      question: "I have a specific nickname for you. Type it below:", 
      answer: "babu", 
      hint: "It starts with 'B' and is 4 letters long. 👶",
      reward: "Aww! Reward: Check the 'Saved Messages' in our chat for a voice note. 🎤" 
    },
    { 
      id: 4, 
      question: "What color was the dress you wore on my last birthday?", 
      answer: "red", 
      hint: "It's the color of roses (and my face when I see you). 🌹",
      reward: "You look beautiful in it. Reward: I'm cooking dinner tonight! 🍝" 
    },
    { 
      id: 5, 
      question: "Virtual Hunt: What is the passcode to my phone?", 
      answer: "1234", 
      hint: "It's the most common password in the world. 🔢",
      reward: "Correct! Reward: A hidden chocolate bar is inside your laptop bag! 🍫" 
    },
    { 
      id: 6, 
      question: "Almost there. Enter the date of our Anniversary (DDMM)", 
      answer: "1016", 
      hint: "It's in October! 📅",
      reward: "Perfect. Reward: A custom Spotify Playlist I made just for you. 🎵" 
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

  const checkAnswer = () => {
    if (inputAnswer.trim().toLowerCase() === activeQuest.answer.toLowerCase()) {
        localStorage.setItem(`quest_${activeQuest.id}`, 'true');
        setShowReward(activeQuest.reward);
        setActiveQuest(null);
        setInputAnswer("");
        setShowHint(false);
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

      {/* QUEST MODAL */}
      {activeQuest && (
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
      
      {/* NO RESET BUTTON HERE ANYMORE */}
    </div>
  );
}

export default App;