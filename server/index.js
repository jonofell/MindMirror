
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: [`https://${process.env.REPLIT_DEV_DOMAIN}`, `https://${process.env.REPLIT_DEV_DOMAIN}:3000`, `https://${process.env.REPLIT_DEV_DOMAIN}:8082`],
  credentials: true
}));
app.use(express.json());

// In-memory storage
let entries = [];

// Get all journal entries
app.get('/api/entries', (req, res) => {
  res.json({ entries });
});

// Create new journal entry
app.post('/api/entries', async (req, res) => {
  try {
    const { content } = req.body;
    console.log('Received entry:', content);

    const entry = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now()
    };

    entries.unshift(entry);
    console.log('Saved entry:', entry);
    res.json(entry);
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple sentiment analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('Analyzing text:', text);
    
    // Simple mock analysis
    const analysis = {
      sentiment: 'positive',
      score: 0.8
    };

    console.log('Analysis result:', analysis);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
