export default async function handler(req, res) {
  // Açar birbaşa kodda deyil, mühit dəyişənlərindən (environment variable) oxunur
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ reply: "API açarı konfiqurasiya edilməyib." });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://e-sikayet-ai.vercel.app",
          "X-Title": "E-Sikayet AI"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content: "Sən Azərbaycan dilində danışan E-Şikayət AI asistentisən. Vətəndaşın problemini öyrən, lazım olduqda əlavə suallar ver və rəsmi müraciət hazırlamağa kömək et."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        reply: data.error?.message || "OpenRouter xətası"
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Cavab alınmadı"
    });

  } catch (err) {
    return res.status(500).json({
      reply: "Server xətası: " + err.message
    });
  }
}
