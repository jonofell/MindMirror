import { supabase } from './supabase';

const INITIAL_PROMPTS = [
  "What's on your mind right now?",
  "How has your day been going?",
  "What are you grateful for today?"
];

export async function generateSuggestions(entries: string[], mood: string): Promise<string[]> {
  if (entries.length === 0) {
    return INITIAL_PROMPTS;
  }

  try {
    const { data, error } = await supabase.functions.invoke('clever-processor', {
      body: { 
        entries: entries.map(entry => ({ response: entry })),
        mood,
        timestamp: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Error from edge function:', error);
      return INITIAL_PROMPTS;
    }

    return data?.suggestions || INITIAL_PROMPTS;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return INITIAL_PROMPTS;
  }
}