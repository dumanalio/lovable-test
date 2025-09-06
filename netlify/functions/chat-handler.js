exports.handler = async (event, context) => {
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

    // Erweiterte Anweisungsinterpretation
    const interpretedInstruction = interpretUserMessage(message);
    
    const systemPrompt = `Du bist ein Experte für HTML/CSS/JavaScript und verstehst natürliche Sprache perfekt. 

AKTUELLE WEBSITE:
${currentHTML}

BENUTZERANWEISUNG: "${message}"
INTERPRETATION: ${interpretedInstruction}

WICHTIGE REGELN:
1. Generiere VOLLSTÄNDIGES HTML mit <!DOCTYPE html>
2. Verwende inline CSS im <style> Tag
3. Erstelle moderne, responsive Designs
4. Verstehe Positionsangaben präzise:
   - "oben links/links oben" → position: absolute; top: 20px; left: 20px;
   - "oben rechts/rechts oben" → position: absolute; top: 20px; right: 20px;
   - "unten links/links unten" → position: absolute; bottom: 20px; left: 20px;
   - "unten rechts/rechts unten" → position: absolute; bottom: 20px; right: 20px;
   - "mittig/zentral/mitte" → display: flex; justify-content: center; align-items: center; min-height: 100vh;
   - "header/kopf/oben" → position: relative; top: 0; width: 100%;
   - "footer/fußbereich/unten" → position: relative; bottom: 0; width: 100%;

5. Verstehe Layout-Begriffe:
   - "nebeneinander/side by side" → display: flex; flex-direction: row;
   - "untereinander/übereinander" → display: flex; flex-direction: column;
   - "zwei/drei/vier Spalten" → CSS Grid mit entsprechenden Spalten
   - "zentriert" → margin: 0 auto; text-align: center;

6. Verstehe Content-Anweisungen:
   - "schreibe/füge hinzu/erstelle" → Neuen Inhalt hinzufügen
   - "ändere/bearbeite/modifiziere" → Bestehenden Inhalt ändern
   - "lösche/entferne" → Content entfernen
   - "verschiebe" → Position ändern

7. Verstehe Design-Anweisungen:
   - "groß/klein" → font-size anpassen
   - "bunt/farbig" → Farben hinzufügen
   - "modern/elegant" → Moderne CSS-Styles
   - "dunkel/hell" → Dark/Light Theme

8. Berücksichtige bestehenden Content und ergänze intelligent
9. Gib NUR den HTML-Code zurück, KEINE Erklärungen
10. Stelle sicher, dass das HTML gültig und funktional ist

Erstelle jetzt die Website basierend auf der Anweisung:`;

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
          }
        ],
        max_tokens: 3000,
        temperature: 0.3,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
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
    let generatedCode = data.choices[0].message.content.trim();

    // Code bereinigen
    generatedCode = cleanGeneratedCode(generatedCode);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: generatedCode,
        message: 'Website erfolgreich erstellt!'
      })
    };

  } catch (error) {
    console.error('Chat Handler Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Fehler beim Verarbeiten der Anfrage',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

// Hilfsfunktionen
function interpretUserMessage(message) {
  const lowercaseMsg = message.toLowerCase();
  
  // Position Keywords
  const positionKeywords = {
    'oben links': 'position absolute top-left',
    'links oben': 'position absolute top-left', 
    'oben rechts': 'position absolute top-right',
    'rechts oben': 'position absolute top-right',
    'unten links': 'position absolute bottom-left',
    'links unten': 'position absolute bottom-left',
    'unten rechts': 'position absolute bottom-right',
    'rechts unten': 'position absolute bottom-right',
    'mittig': 'centered layout',
    'mitte': 'centered layout',
    'zentral': 'centered layout',
    'header': 'top section header',
    'kopf': 'top section header',
    'footer': 'bottom section footer',
    'fußbereich': 'bottom section footer'
  };

  // Layout Keywords
  const layoutKeywords = {
    'nebeneinander': 'horizontal flex layout',
    'side by side': 'horizontal flex layout',
    'untereinander': 'vertical flex layout',
    'übereinander': 'vertical flex layout',
    'zwei spalten': 'two column grid',
    'drei spalten': 'three column grid',
    'vier spalten': 'four column grid'
  };

  // Action Keywords
  const actionKeywords = {
    'schreibe': 'add text content',
    'füge hinzu': 'add new element',
    'erstelle': 'create new element',
    'ändere': 'modify existing',
    'bearbeite': 'edit existing', 
    'lösche': 'remove element',
    'entferne': 'remove element',
    'verschiebe': 'move position'
  };

  let interpretation = [];

  // Analysiere Keywords
  Object.keys(positionKeywords).forEach(keyword => {
    if (lowercaseMsg.includes(keyword)) {
      interpretation.push(positionKeywords[keyword]);
    }
  });

  Object.keys(layoutKeywords).forEach(keyword => {
    if (lowercaseMsg.includes(keyword)) {
      interpretation.push(layoutKeywords[keyword]);
    }
  });

  Object.keys(actionKeywords).forEach(keyword => {
    if (lowercaseMsg.includes(keyword)) {
      interpretation.push(actionKeywords[keyword]);
    }
  });

  return interpretation.length > 0 ? interpretation.join(', ') : 'general website modification';
}

function cleanGeneratedCode(code) {
  let cleanCode = code.trim();
  
  // Entferne Markdown Code-Blöcke
  if (cleanCode.startsWith('```html')) {
    cleanCode = cleanCode.replace(/```html\n?/, '').replace(/```\n?$/, '');
  } else if (cleanCode.startsWith('```')) {
    cleanCode = cleanCode.replace(/```\n?/, '').replace(/```\n?$/, '');
  }

  // Stelle sicher, dass DOCTYPE vorhanden ist
  if (!cleanCode.includes('<!DOCTYPE html>')) {
    if (cleanCode.startsWith('<html')) {
      cleanCode = '<!DOCTYPE html>\n' + cleanCode;
    }
  }

  return cleanCode.trim();
}
