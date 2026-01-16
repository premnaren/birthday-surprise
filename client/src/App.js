import React, { useState, useEffect } from 'react';
import BirthdayReveal from './BirthdayReveal';
import './App.css';

function App() {
  const [status, setStatus] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showReward, setShowReward] = useState(null); 
  
  // NEW: State to toggle hint visibility
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    fetch('https://birthday-surprise-fa8d.onrender.com/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => {
          console.error("Error connecting to server:", err);
          setStatus({ daysLeft: 7, unlockedLevel: 1, isBirthday: false });
      });
  }, []);

  // ---------------------------------------------------------
  // 2. THE 7 QUESTS (Now with HINTS!)
  // ---------------------------------------------------------
  const quests = [
      { 
        id: 1, 
        question: "Let's start easy. Where did we go for our very first date?", 
        answer: "coffee", 
        hint: "It involves beans and milk! ☕", // <--- NEW HINT
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

  const handleQuestClick = (quest) => {
      setActiveQuest(quest);
      setInputAnswer("");
      setShowHint(false); // Reset hint when opening a new quest
  };

  const checkAnswer = () => {
      const cleanInput = inputAnswer.trim().toLowerCase();
      const cleanAnswer = activeQuest.answer.toLowerCase();

      if (cleanInput === cleanAnswer) {
          localStorage.setItem(`quest_${activeQuest.id}`, 'true');
          setShowReward(activeQuest.reward);
          setActiveQuest(null);
          setInputAnswer("");
      } else {
          alert("Wrong answer! Try again, love. ❌");
      }
  };

  const closeReward = () => {
      setShowReward(null);
  };

  if (!status) return <div className="loading">Loading your surprise...</div>;

 // 5. THE BIRTHDAY VIEW (Day 0)
if (status.isBirthday) {
    return <BirthdayReveal />;
}

  return (
    <div className="app-container">
      <h1>🎂 {status.daysLeft} Days to Go! 🎂</h1>
      <p className="subtitle">Complete the daily quest to unlock your special reward</p>
      
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
                        if (isUnlocked && !isCompleted) handleQuestClick(q);
                    }}
                >
                    <div className="day-badge">Day {level}</div>
                    <div className="status-icon">
                        {isCompleted ? "✅" : (isUnlocked ? "🔓" : "🔒")}
                    </div>
                </div>
            );
        })}
      </div>

      {/* QUESTION MODAL */}
      {activeQuest && (
          <div className="modal">
              <div className="modal-content">
                  <h2>Day {activeQuest.id} Challenge</h2>
                  <p className="question-text">{activeQuest.question}</p>
                  
                  <input 
                      type="text"
                      value={inputAnswer} 
                      onChange={(e) => setInputAnswer(e.target.value)} 
                      placeholder="Type your answer..."
                      className="answer-input"
                      autoFocus
                  />

                  {/* --- NEW HINT SECTION --- */}
                  <div className="hint-section">
                      {!showHint ? (
                          <button className="btn-hint-toggle" onClick={() => setShowHint(true)}>
                              💡 Need a Hint?
                          </button>
                      ) : (
                          <p className="hint-text">
                              <strong>Hint:</strong> {activeQuest.hint}
                          </p>
                      )}
                  </div>
                  {/* ------------------------ */}
                  
                  <div className="button-group">
                      <button className="btn-submit" onClick={checkAnswer}>Submit</button>
                      <button className="btn-close" onClick={() => setActiveQuest(null)}>Cancel</button>
                  </div>
              </div>
          </div>
      )}

      {/* REWARD MODAL */}
      {showReward && (
          <div className="modal reward-overlay">
              <div className="modal-content reward-card">
                  <div className="confetti">🎉</div>
                  <h2>Quest Complete!</h2>
                  <p className="reward-label">Your Reward:</p>
                  <p className="reward-text">{showReward}</p>
                  <button className="btn-claim" onClick={closeReward}>Claim Reward 🎁</button>
              </div>
          </div>
      )}
    </div>
  );
}

export default App;