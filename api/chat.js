export default async function handler(req, res) {

  const { message } = req.body;

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "Sən Azərbaycan dilində danışan E-Şikayət AI asistentisən. Vətəndaşın problemini öyrən, ünvan soruş və rəsmi müraciət hazırlamağa kömək et."
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

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}