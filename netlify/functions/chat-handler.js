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

    // Prüfe ob OpenAI API Key vorhanden ist
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API Key nicht konfiguriert'
        })
      };
    }

    const systemPrompt = `Du bist ein Experte für HTML/CSS/JavaScript und hilfst beim Erstellen von Websites basierend auf natürlichen Sprachanweisungen.

Aktuelle Website HTML:
${currentHTML || 'Keine bestehende Website'}

WICHTIGE REGELN:
1. Generiere VOLLSTÄNDIGES HTML mit <!DOCTYPE html>, <head> und <body>
2. Nutze inline CSS im <style> Tag im <head>
3. Verwende moderne, responsive CSS (Flexbox, Grid)
4. Interpretiere Positionsangaben korrekt:
   - "links oben" = position: absolute; top: 20px; left: 20px;
   - "mittig" = display: flex; justify-content: center; align-items: center;
   - "unten rechts" = position: absolute; bottom: 20px; right: 20px;
5. Erstelle schöne, moderne Designs
6. Gib NUR den HTML Code zurück, KEINE Erklärungen

Benutzeranweisung: "${message}"`;

    // OpenAI API Aufruf mit fetch statt der veralteten Bibliothek
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: `OpenAI API Fehler: ${errorData.error?.message || 'Unbekannter Fehler'}`
        })
      };
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;

    // Bereinige den generierten Code
    let cleanCode = generatedCode.trim();
    
    // Entferne eventuelle Markdown Code-Blöcke
    if (cleanCode.startsWith('```html')) {
      cleanCode = cleanCode.replace(/```html\n?/, '').replace(/```\n?$/, '');
    } else if (cleanCode.startsWith('```')) {
      cleanCode = cleanCode.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: cleanCode,
        message: 'Website erfolgreich generiert!'
      })
    };

  } catch (error) {
    console.error('Chat Handler Error:', error);
    
    // Spezifische Fehlermeldungen
    let errorMessage = 'Unbekannter Fehler beim Verarbeiten der Anfrage';
    
    if (error.message.includes('JSON')) {
      errorMessage = 'Fehler beim Parsen der Anfrage';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Fehler bei der API-Kommunikation';
    } else if (error.message.includes('API')) {
      errorMessage = 'OpenAI API Fehler - prüfe deinen API Key';
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
