const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000; // Render sets this automatically, but good for local

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    // 1. Get the date from the frontend request (e.g. ?date=2026-10-16)
    const { date } = req.query;

    // Default response if no date is provided
    if (!date) {
        return res.json({ daysLeft: null, unlockedLevel: 0, isBirthday: false });
    }

    const today = new Date();
    const targetDate = new Date(date);

    // Reset the time part to midnight to ensure accurate day calculation
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    // Calculate difference
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Logic: 7 Days out = Level 1. Birthday = Level 8.
    let unlockedLevel = 0;
    
    if (diffDays <= 7 && diffDays > 0) {
        unlockedLevel = 8 - diffDays; 
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
    console.log(`Server running on port ${PORT}`);
});