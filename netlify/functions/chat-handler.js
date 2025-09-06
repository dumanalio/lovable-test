const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, currentHTML = '' } = JSON.parse(event.body);

    const systemPrompt = `Du bist ein Assistent, der HTML/CSS/JS Code generiert basierend auf natürlichen Sprachanweisungen. 
    
Regeln:
- Generiere vollständiges HTML mit inline CSS und JavaScript
- Verwende moderne, responsive CSS
- Interpretiere Positionsangaben wie "links oben", "mittig", "unten rechts" korrekt
- Gib nur den HTML-Code zurück, keine Erklärungen
- Nutze das aktuelle HTML als Basis und erweitere es entsprechend

Aktueller HTML-Code:
${currentHTML}

Benutzeranweisung: ${message}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const generatedCode = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: generatedCode,
        message: 'Code erfolgreich generiert'
      })
    };

  } catch (error) {
    console.error('Chat Handler Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Fehler beim Verarbeiten der Anfrage'
      })
    };
  }
};
