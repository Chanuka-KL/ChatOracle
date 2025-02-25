import OpenAI from 'openai';

export default async (req, res) => {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN
  });

  try {
    const { question } = req.body;
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
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
};