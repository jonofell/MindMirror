const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://mindmirror-production-b2e2.up.railway.app', 'http://0.0.0.0:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// File-based storage path
const STORAGE_FILE = path.join(__dirname, 'entries.json');

// Load entries from file or initialize empty array
async function loadEntries() {
  try {
    await fs.access(STORAGE_FILE);
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(STORAGE_FILE, '[]');
    return [];
  }
}

// Save entries to file
async function saveEntries(entries) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(entries, null, 2));
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

app.post('/api/reflect', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Missing content' });
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
          content: content
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

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await loadEntries();
    res.json({ entries });
  } catch (error) {
    console.error('Error loading entries:', error);
    res.status(500).json({ error: 'Failed to load entries' });
  }
});

app.post('/api/entries', async (req, res) => {
  try {
    console.log('Received entry request:', req.body);
    
    const { content } = req.body;
    if (!content) {
      console.log('Missing content in request');
      return res.status(400).json({ error: 'Missing content' });
    }

    const entry = {
      id: uuidv4(),
      content: content,
      timestamp: Date.now()
    };

    console.log('Created entry:', entry);

    const entries = await loadEntries();
    entries.unshift(entry);
    await saveEntries(entries);

    console.log('Entry saved successfully');
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).json({ error: 'Failed to save entry', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});