
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all journal entries (placeholder for now)
app.get('/api/entries', (req, res) => {
  // TODO: Add database integration
  res.json({ entries: [] });
});

// Create new journal entry
app.post('/api/entries', async (req, res) => {
  try {
    const { content } = req.body;
    
    // TODO: Add database integration
    // For now, just return the entry
    res.json({
      id: Date.now(),
      content,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze text with AI (placeholder)
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Example AI analysis endpoint call
    // const response = await axios.post('AI_API_ENDPOINT', {
    //   text,
    // }, {
    //   headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` }
    // });
    
    res.json({ analysis: "AI analysis will go here" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
