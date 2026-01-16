// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
// IMPORTANT: Set this to her actual birthday year, month (0-11), and day.
// Month is 0-indexed (Jan=0, Feb=1, ... Oct=9).
// Example: October 16, 2026
const BIRTHDAY_DATE = new Date(2026, 0, 16); 

app.get('/api/status', (req, res) => {
    const today = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = BIRTHDAY_DATE - today;
    
    // Convert to days (Math.ceil rounds up)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Logic: 
    // If diffDays is 7, Level 1 is unlocked.
    // If diffDays is 0, It is the Birthday.
    let unlockedLevel = 0;
    
    if (diffDays <= 7 && diffDays > 0) {
        unlockedLevel = 8 - diffDays; // e.g., 7 days left = Level 1
    } else if (diffDays <= 0) {
        unlockedLevel = 8; // Birthday Mode
    }

    res.json({
        daysLeft: diffDays,
        unlockedLevel: unlockedLevel, 
        isBirthday: diffDays <= 0
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});