const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let entries = [];

// Get all journal entries
app.get('/api/entries', (req, res) => {
  res.json({ entries });
});

// Create new journal entry
app.post('/api/entries', (req, res) => {
  try {
    const { content } = req.body;
    const entry = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now()
    };
    entries.unshift(entry);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});