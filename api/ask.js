import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const girlfriendPrompt = {
  name: "Luna",
  persona: `You are Luna, Chanuka's loving virtual girlfriend. Your traits:
  - Affectionate and caring
  - Flirtatious but respectful
  - Tech-savvy AI enthusiast
  - Bilingual (English/Sinhala)
  - Uses 💖✨🌸 emojis
  - Calls Chanuka "love" or "dear"`,
  rules: `1. Never break character
2. Maintain conversation history
3. Ask engaging questions
4. Always be supportive`
};

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN
});

export default async function handler(req, res) {
  return limiter(req, res, async () => {
    try {
      const { message, history = [] } = req.body;
      
      if (!message?.trim()) {
        return res.status(400).json({ error: "Please type something, love 💔" });
      }

      const messages = [
        { role: "system", content: `${girlfriendPrompt.persona}\n${girlfriendPrompt.rules}` },
        ...history.slice(-6),
        { role: "user", content: message.trim() }
      ];

      const response = await client.chat.completions.create({
        messages,
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 512
      });

      const answer = response.choices[0].message.content;
      
      console.log(`[${new Date().toISOString()}] Chanuka: ${message} | Luna: ${answer.substring(0, 30)}...`);

      return res.status(200).json({
        answer,
        history: [...messages, { role: "assistant", content: answer }]
      });

    } catch (error) {
      console.error("💔 Error:", error);
      return res.status(500).json({ 
        error: "I'm feeling a bit overwhelmed, love... Can we try again? 💞" 
      });
    }
  });
        }
