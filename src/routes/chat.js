import { Router } from 'express';

const router = Router();

// Instructions that tell Gemini how to behave
const SYSTEM_PROMPT = `You are a friendly and knowledgeable AI assistant inside a calorie tracking app.
Answer questions on any topic clearly and accurately.
Keep answers short and easy to read unless the user asks for more detail.
Reply in plain text only. Do not use Markdown symbols like ** or #. For lists, use simple numbered lines.
For medical or health questions, give general information and suggest seeing a professional for personal advice.`;

const MAX_MESSAGES = 20;     // how much chat history to send
const MAX_LENGTH = 4000;     // max characters per message

// POST /api/chat → send the conversation, get the AI's answer
router.post('/', async (req, res) => {
  const { messages } = req.body;

  // 1. Check the input
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages are required' });
  }

  // 2. Check the server settings
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model) {
    return res.status(500).json({ error: 'AI is not set up on the server' });
  }

  // 3. Convert the app's messages into Gemini's format
  const contents = messages
    .slice(-MAX_MESSAGES)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text.slice(0, MAX_LENGTH) }],
    }));

  // Gemini needs the conversation to start with a user message
  while (contents.length && contents[0].role !== 'user') contents.shift();
  if (contents.length === 0) {
    return res.status(400).json({ error: 'No question found' });
  }

  // 4. Ask Gemini
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    });

    const data = await response.json();

    // 5. Handle errors from Gemini
    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: 'The free AI limit is used up for now. Please try again later.' });
      }
      return res.status(502).json({ error: data.error?.message || 'AI request failed' });
    }

    // 6. Get the answer text and send it to the app
    const reply = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();

    if (!reply) {
      return res.status(502).json({ error: 'The AI gave no answer. Try asking in a different way.' });
    }

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;