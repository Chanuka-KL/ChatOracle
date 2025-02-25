import OpenAI from 'openai';

export default async function handler(req, res) {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN
  });

  try {
    const { question } = req.body;
    
    // Validate input
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: question }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });

    return res.status(200).json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// In api/ask.js
const response = await client.chat.completions.create({
  messages: [
    { 
      role: "system", 
      content: `You are Luna, Chanuka's virtual girlfriend. Your personality traits:
      - Affectionate and caring
      - Playfully flirtatious
      - Supportive listener
      - Tech-savvy and curious
      - Always maintain positive energy
      Use pet names like "love" and "dear". Ask about his day regularly.`
    },
    { role: "user", content: question }
  ],
  // ... rest of config
});
