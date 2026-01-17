import React, { useState } from 'react';
import './App.css';

const NumberLock = ({ targetCode, hint, onUnlock, onClose }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('neutral'); // 'neutral', 'error', 'success'

    const handlePress = (num) => {
        if (status !== 'neutral') return; // Block input during animation
        if (input.length < 4) {
            setInput(prev => prev + num);
        }
    };

    const handleClear = () => {
        setInput('');
        setStatus('neutral');
    };

    const handleCheck = () => {
        if (input === targetCode) {
            setStatus('success');
            setTimeout(onUnlock, 1000); // Wait 1 sec for success animation, then unlock
        } else {
            setStatus('error');
            // Shake and reset after 0.5s
            setTimeout(() => {
                setInput('');
                setStatus('neutral');
            }, 500);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content lock-container">
                <div className="lock-header">
                    <h2>🔐 Security Check</h2>
                    <p>{hint}</p>
                </div>

                {/* LCD Display Screen */}
                <div className={`lock-display ${status}`}>
                    {/* Show dots for entered numbers, or empty placeholders */}
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className={i < input.length ? 'dot filled' : 'dot'}></span>
                    ))}
                </div>

                {/* Status Message on Screen */}
                <div className="lock-status-text">
                    {status === 'error' ? "ACCESS DENIED" : (status === 'success' ? "ACCESS GRANTED" : "ENTER PIN")}
                </div>

                {/* Numpad */}
                <div className="numpad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button key={num} onClick={() => handlePress(num.toString())}>{num}</button>
                    ))}
                    <button className="btn-control clear" onClick={handleClear}>CLR</button>
                    <button onClick={() => handlePress('0')}>0</button>
                    <button className="btn-control enter" onClick={handleCheck}>🔓</button>
                </div>

                <button className="btn-close-text" onClick={onClose}>Exit Vault</button>
            </div>
        </div>
    );
};

export default NumberLock;