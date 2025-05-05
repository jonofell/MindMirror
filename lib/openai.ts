
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateSuggestions(entries: string[], mood: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a compassionate journal assistant. Based on the user's entries and current mood, provide 3 thoughtful, relevant prompts for further reflection. Keep responses concise and focused on emotional growth."
        },
        {
          role: "user",
          content: `Previous entries: ${entries.join('\n')}\nCurrent mood: ${mood}\nGenerate 3 relevant prompts for deeper reflection.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const suggestions = response.choices[0].message.content.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3);
      
    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      "What's on your mind right now?",
      "How has your day been going?",
      "What are you grateful for today?"
    ];
  }
}
