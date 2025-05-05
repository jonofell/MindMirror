
import { supabase } from './supabase';

export async function generateSuggestions(entries: string[], mood: string): Promise<string[]> {
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
      return getDefaultPrompts();
    }

    return data?.suggestions || getDefaultPrompts();
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return getDefaultPrompts();
  }
}

function getDefaultPrompts(): string[] {
  return [
    "What's on your mind right now?",
    "How has your day been going?",
    "What are you grateful for today?"
  ];
}
