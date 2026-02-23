// Calls /api/summarize so API keys stay server-side.
// Falls back to simple truncation if the API is unreachable.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Generate an AI summary for the given text via the serverless API.
 * Handles multi-provider fallback (Gemini → OpenRouter → GitHub Models).
 *
 * @param {string} text - The document content to summarize
 * @returns {Promise<{summary: string, provider: string}>}
 */
export async function getAISummary(text) {
  if (!text || typeof text !== "string") {
    return { summary: "No content to summarize.", provider: "none" };
  }

  try {
    const response = await fetch(`${API_BASE}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.substring(0, 2000) })
    });

    if (!response.ok) {
      console.error("AI API returned status", response.status);
      return { summary: text.substring(0, 80) + "...", provider: "fallback" };
    }

    const data = await response.json();
    return {
      summary: data.summary || text.substring(0, 80) + "...",
      provider: data.provider || "unknown"
    };
  } catch (err) {
    console.error("AI service unreachable:", err.message);
    return { summary: text.substring(0, 80) + "...", provider: "fallback" };
  }
}
