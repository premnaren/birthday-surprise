import React, { useState, useEffect } from 'react';
import './App.css';
import BirthdayReveal from './BirthdayReveal';
import FlowerGarden from './FlowerGarden';

function App() {
  const [status, setStatus] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showReward, setShowReward] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // --- THEME STATE ---
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');

  // Apply Theme Logic
  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine if we should be dark
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);

    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    
    localStorage.setItem('app_theme', theme);
  }, [theme]);
  
  // NEW: Store the user's birthdate
  const [userDate, setUserDate] = useState(localStorage.getItem('birthday_date') || "");

  // 1. Fetch Status (Now Dynamic!)
  useEffect(() => {
    if (!userDate) return; // Don't fetch if we don't have a date yet

    // Replace with your RENDER URL in production!
    const API_BASE = 'https://birthday-surprise-fa8d.onrender.com'; 
    // const API_BASE = 'https://your-render-app.onrender.com';

    fetch(`${API_BASE}/api/status?date=${userDate}`)
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error("Error:", err));
  }, [userDate]);

  // Handle Date Submit
  const handleDateSubmit = (e) => {
      e.preventDefault();
      const dateInput = e.target.elements.date.value;
      if(dateInput) {
          localStorage.setItem('birthday_date', dateInput);
          setUserDate(dateInput);
      }
  };

// --- QUEST DATA (The Full List) ---
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

  // --- LOGIC HANDLERS ---
  const checkAnswer = () => {
      if (inputAnswer.trim().toLowerCase() === activeQuest.answer.toLowerCase()) {
          localStorage.setItem(`quest_${activeQuest.id}`, 'true');
          setShowReward(activeQuest.reward);
          setActiveQuest(null);
          setInputAnswer("");
      } else {
          alert("Try again! ❌");
      }
  };

  

  // --- VIEW 1: DATE ENTRY SCREEN ---
  if (!userDate) {
      return (
          <div className="app-container intro-screen">
              <div className="card intro-card">
                  <h1>👋 Welcome!</h1>
                  <p>Please enter your special date to begin.</p>
                  <form onSubmit={handleDateSubmit}>
                      <input type="date" name="date" required className="date-input" />
                      <button type="submit" className="btn-submit">Enter</button>
                  </form>
              </div>
          </div>
      );
  }

  // --- HELPER: Calculate Unlock Date ---
  const getUnlockDate = (dayLevel) => {
      if (!userDate) return "";
      const target = new Date(userDate);
      // Logic: Day 1 unlocks 7 days before birthday. Day 7 unlocks 1 day before.
      // Days to subtract = 8 - dayLevel
      target.setDate(target.getDate() - (8 - dayLevel));
      
      // Return pretty format (e.g., "Jan 16")
      return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- VIEW 2: LOADING ---
  if (!status) return <div className="loading">Checking the timeline...</div>;

  // --- VIEW 3: BIRTHDAY ---
  if (status.isBirthday) return <BirthdayReveal />;

  // --- VIEW 4: COUNTDOWN & QUESTS ---
  return (
    <div className="app-container">
      {/* 🌸 THE MAGIC BACKGROUND 🌸 */}
      <FlowerGarden />

      {/* THEME TOGGLE BUTTONS */}
      <div className="theme-toggle">
        <button 
            className={theme === 'light' ? 'active' : ''} 
            onClick={() => setTheme('light')} 
            title="Light Mode">☀️</button>
        <button 
            className={theme === 'system' ? 'active' : ''} 
            onClick={() => setTheme('system')} 
            title="System Default">💻</button>
        <button 
            className={theme === 'dark' ? 'active' : ''} 
            onClick={() => setTheme('dark')} 
            title="Dark Mode">🌙</button>
      </div>
      <h1>🎂 {status.daysLeft} Days to Go! 🎂</h1>
      <p className="subtitle">Target: {new Date(userDate).toDateString()}</p>
      
      <div className="quest-grid">
        {quests.map((q, index) => {
            const level = index + 1;
            const isUnlocked = level <= status.unlockedLevel;
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

                    {/* 👇 PASTE THIS NEW CODE HERE 👇 */}
                    {!isUnlocked && (
                        <div className="locked-tooltip">
                            Unlocks {getUnlockDate(level)} 🔒
                        </div>
                    )}
                    {/* 👆 END OF NEW CODE 👆 */}

                </div>
            );
        })}
      </div>

      {/* MODALS (Quest & Reward) - Same as before */}
      {activeQuest && (
          <div className="modal">
              <div className="modal-content">
                  <h2>Day {activeQuest.id}</h2>
                  <p>{activeQuest.question}</p>
                  <input value={inputAnswer} onChange={e => setInputAnswer(e.target.value)} className="answer-input" />
                  <button className="btn-hint-toggle" onClick={() => setShowHint(!showHint)}>💡 Hint</button>
                  {showHint && <p className="hint-text">{activeQuest.hint}</p>}
                  <button className="btn-submit" onClick={checkAnswer}>Submit</button>
                  <button className="btn-close" onClick={() => setActiveQuest(null)}>Cancel</button>
              </div>
          </div>
      )}
      {showReward && (
          <div className="modal reward-overlay">
             <div className="modal-content reward-card">
                 <h2>🎉 Quest Complete!</h2>
                 <p>{showReward}</p>
                 <button className="btn-claim" onClick={() => setShowReward(null)}>Close</button>
             </div>
          </div>
      )}
      
      {/* RESET BUTTON (For testing) */}
      <button 
        className="btn-reset" 
        onClick={() => {
            localStorage.clear();
            window.location.reload();
        }}
      >
        🔄 Reset App
      </button>
    </div>
  );
}

export default App;