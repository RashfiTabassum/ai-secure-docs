/**
 * Vercel Serverless API Route – AI Summarization
 *
 * Keeps all API keys server-side. Supports three LLM providers
 * with automatic fallback: Gemini Flash → OpenRouter → GitHub Models.
 *
 * Required env vars (set in Vercel dashboard):
 *   GEMINI_API_KEY, OPENROUTER_API_KEY, GITHUB_TOKEN
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' field" });
  }

  const trimmed = text.substring(0, 2000); // limit input size
  const systemPrompt = "You are a summarization expert. Create a 1-2 sentence summary (max 30 words). Be extremely concise.";
  const userPrompt = `Summarize this in 1 sentence (max 20 words): ${trimmed}`;

  // Provider 1 – Google Gemini Flash (free tier)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { maxOutputTokens: 60, temperature: 0.1 }
          })
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (summary) {
          return res.status(200).json({ summary, provider: "gemini" });
        }
      }
    } catch (err) {
      console.error("Gemini failed, trying next provider:", err.message);
    }
  }

  // Provider 2 – OpenRouter free models
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ai-notes-pro.vercel.app",
          "X-Title": "AI Doc Manager"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 60,
          temperature: 0.1
        })
      });
      if (orRes.ok) {
        const data = await orRes.json();
        const summary = data.choices?.[0]?.message?.content?.trim();
        if (summary) {
          return res.status(200).json({ summary, provider: "openrouter" });
        }
      }
    } catch (err) {
      console.error("OpenRouter failed, trying next provider:", err.message);
    }
  }

  // Provider 3 – GitHub Models / Phi-4 (third fallback)
  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken) {
    try {
      const ghRes = await fetch("https://models.github.ai/inference/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "microsoft/Phi-4-mini-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      });
      if (ghRes.ok) {
        const data = await ghRes.json();
        const summary = data.choices?.[0]?.message?.content?.trim();
        if (summary) {
          return res.status(200).json({ summary, provider: "github" });
        }
      }
    } catch (err) {
      console.error("GitHub Models failed:", err.message);
    }
  }

  // Fallback: simple truncation if all providers fail
  return res.status(200).json({
    summary: trimmed.substring(0, 80) + "...",
    provider: "fallback"
  });
}
