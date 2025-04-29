
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'API server is running' });
});

// File-based storage path
const STORAGE_FILE = path.join(__dirname, 'entries.json');

// Load entries from file or initialize empty array
async function loadEntries() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save entries to file
async function saveEntries(entries) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(entries, null, 2));
}

// Get all journal entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await loadEntries();
    res.json({ entries });
  } catch (error) {
    console.error('Error loading entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new journal entry
app.post('/api/entries', async (req, res) => {
  try {
    const { content } = req.body;

    // Input validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid content field' });
    }

    const entry = {
      id: uuidv4(),
      content: content.trim(),
      timestamp: Date.now()
    };

    const entries = await loadEntries();
    entries.unshift(entry);
    await saveEntries(entries);

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/reflect', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid content field' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journal reflection assistant. Analyze the journal entry and provide a brief, insightful reflection that helps the user gain deeper understanding of their thoughts and feelings."
        },
        {
          role: "user",
          content: content.trim()
        }
      ],
    });

    const reflection = completion.choices[0].message.content;
    res.json({ reflection });
  } catch (error) {
    console.error('Error generating reflection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate reflection for journal entry
app.post('/api/reflect', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid content field' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journal reflection coach. Your role is to encourage deeper understanding and personal growth. Provide calming, non-judgmental insights based on the journal entry provided."
        },
        {
          role: "user",
          content: `Here is my journal entry: "${content}". Reflect on it gently. Highlight emotional patterns, growth opportunities, or calming advice.`
        }
      ],
    });

    const reflection = completion.choices[0].message.content;
    res.json({ reflection });
  } catch (error) {
    console.error('Error generating reflection:', error);
    res.status(500).json({ error: 'Failed to generate reflection' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
