// src/api/openai.js
export async function chatCompletion(messages, opts = {}) {
    const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    if (!OPENAI_KEY) throw new Error("OpenAI API key missing in .env.local");
  
    const payload = {
      model: opts.model || "gpt-4o-mini",
      messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.max_tokens ?? 700,
    };
  
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI error: ${res.status} ${text}`);
    }
  
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
  