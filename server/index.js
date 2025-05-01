const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

app.get('/entries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    res.json({ entries: data });
  } catch (error) {
    console.error('Error loading entries:', error);
    res.status(500).json({ error: 'Failed to load entries' });
  }
});

app.post('/entries', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Missing content' });
    }

    const entry = {
      id: uuidv4(),
      content: content,
      timestamp: Date.now()
    };

    const { data, error } = await supabase
      .from('entries')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error processing entry:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});