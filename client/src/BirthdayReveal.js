import React, { useState, useEffect } from 'react';
import FlowerGarden from './FlowerGarden'; // 1. Import the Flowers

const BirthdayReveal = () => {
    // --- THEME LOGIC (Same as App.js) ---
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'system');

    useEffect(() => {
        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark);

        if (isDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    return (
        <div className="birthday-container" style={{ 
            textAlign: 'center', 
            padding: '50px', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-color)', // Use Theme Colors
            position: 'relative'
        }}>
            
            {/* 🌸 1. THE FLOWERS 🌸 */}
            <FlowerGarden />

            {/* 🌗 2. THEME TOGGLE (Top Right) 🌗 */}
            <div className="theme-toggle" style={{ position: 'fixed', top: '20px', right: '20px' }}>
                <button 
                    className={theme === 'light' ? 'active' : ''} 
                    onClick={() => setTheme('light')}>☀️</button>
                <button 
                    className={theme === 'system' ? 'active' : ''} 
                    onClick={() => setTheme('system')}>💻</button>
                <button 
                    className={theme === 'dark' ? 'active' : ''} 
                    onClick={() => setTheme('dark')}>🌙</button>
            </div>

            {/* THE CONTENT CARD */}
            <div className="card" style={{ padding: '40px', maxWidth: '600px', zIndex: 2 }}>
                <h1>🎉 Happy Birthday! 🎉</h1>
                <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                    You unlocked all the surprises! I hope you liked this little digital gift.
                </p>
                
                {/* Placeholder for a photo if you want one */}
                <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    backgroundColor: '#ffe5ec', 
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '20px 0',
                    color: '#ff4d6d'
                }}>
                    (Insert Cute Photo Here) 📸
                </div>

                <p>I love you so much! ❤️</p>
            </div>

            {/* 🔄 3. RESET BUTTON (Bottom Right) 🔄 */}
            <button 
                onClick={() => {
                    if(window.confirm("Are you sure you want to reset the app?")) {
                        localStorage.clear();
                        window.location.reload();
                    }
                }}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '2px solid var(--secondary-color)',
                    padding: '10px 15px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    zIndex: 100,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
            >
                🔄 Reset App
            </button>
        </div>
    );
};

export default BirthdayReveal;