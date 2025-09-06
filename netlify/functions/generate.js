// Netlify Serverless Function: generate.js
// Intelligentes Proxy für OpenAI – User wird in allen Hinsichten verstanden.

exports.handler = async (event, context) => {
  try {
    // OpenAI Key aus Environment Variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API-Key fehlt. Bitte in den Netlify Settings hinzufügen." }),
      };
    }

    // Eingabe aus Frontend
    let userMessage = "Bitte antworte freundlich.";
    if (event.httpMethod === "POST" && event.body) {
      try {
        const body = JSON.parse(event.body);
        if (body.message && body.message.trim().length > 0) {
          userMessage = body.message.trim();
        }
      } catch {
        // Wenn body nicht korrekt ist → Standardnachricht
        userMessage = "Sag Hallo!";
      }
    }

    // Anfrage an OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // schnell, günstig, vielseitig
        temperature: 0.7,     // kreativer, menschlicher
        messages: [
          { role: "system", content: "Du bist ein hilfreicher, freundlicher Assistent. Verstehe jede Eingabe des Users und antworte klar und verständlich." },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Fehler bei OpenAI", details: errorText }),
      };
    }

    const data = await response.json();

    // Extrahiere die wichtigste Antwort
    const aiMessage = data?.choices?.[0]?.message?.content || "Entschuldigung, ich konnte nichts verstehen.";

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: userMessage,
        answer: aiMessage,
        raw: data
      })
    };
  } catch (err) {
    console.error("Fehler in generate.js:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Interner Serverfehler",
        details: err.message
      }),
    };
  }
};
