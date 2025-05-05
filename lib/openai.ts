import { supabase } from './supabase';

export async function generateSuggestions(entries: string[], mood: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('clever-processor', {
      body: { entries, mood, timestamp: Date.now() }
    });

    if (error) throw error;

    return data?.suggestions || [
      "What's on your mind right now?",
      "How has your day been going?",
      "What are you grateful for today?"
    ];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      "What's on your mind right now?",
      "How has your day been going?",
      "What are you grateful for today?"
    ];
  }
}