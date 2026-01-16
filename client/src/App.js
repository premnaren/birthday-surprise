import React, { useState, useEffect } from 'react';
import './App.css';
import BirthdayReveal from './BirthdayReveal';

function App() {
  const [status, setStatus] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showReward, setShowReward] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  // NEW: Store the user's birthdate
  const [userDate, setUserDate] = useState(localStorage.getItem('birthday_date') || "");

  // 1. Fetch Status (Now Dynamic!)
  useEffect(() => {
    if (!userDate) return; // Don't fetch if we don't have a date yet

    // Replace with your RENDER URL in production!
    const API_BASE = 'http://localhost:5000'; 
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

  // --- QUEST DATA (Keep your customized quests here) ---
  const quests = [
      { id: 1, question: "First date spot?", answer: "coffee", hint: "Beans!", reward: "Treat yourself! ☕" },
      // ... Paste your other quests here ...
      { id: 7, question: "Type 'Open'", answer: "open", hint: "Not closed", reward: "Big surprise tomorrow!" }
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

  // --- VIEW 2: LOADING ---
  if (!status) return <div className="loading">Checking the timeline...</div>;

  // --- VIEW 3: BIRTHDAY ---
  if (status.isBirthday) return <BirthdayReveal />;

  // --- VIEW 4: COUNTDOWN & QUESTS ---
  return (
    <div className="app-container">
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
                    onClick={() => { if (isUnlocked && !isCompleted) setActiveQuest(q); }}
                >
                    <div className="day-badge">Day {level}</div>
                    <div className="status-icon">{isCompleted ? "✅" : (isUnlocked ? "🔓" : "🔒")}</div>
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