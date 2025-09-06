const fs = require('fs');
const path = require('path');

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
    const { html, siteName = 'my-website' } = JSON.parse(event.body);

    // Erstelle einen eindeutigen Ordner für die Website
    const siteId = `${siteName}-${Date.now()}`;
    const sitePath = path.join(process.cwd(), 'public', 'generated-sites', siteId);

    // Erstelle Ordner falls nicht vorhanden
    if (!fs.existsSync(sitePath)) {
      fs.mkdirSync(sitePath, { recursive: true });
    }

    // Schreibe HTML-Datei
    const htmlFilePath = path.join(sitePath, 'index.html');
    fs.writeFileSync(htmlFilePath, html, 'utf8');

    // Erstelle eine einfache Manifest-Datei
    const manifest = {
      siteId,
      siteName,
      createdAt: new Date().toISOString(),
      files: ['index.html']
    };

    fs.writeFileSync(
      path.join(sitePath, 'manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        siteId,
        previewUrl: `/generated-sites/${siteId}/index.html`,
        message: 'Website erfolgreich generiert'
      })
    };

  } catch (error) {
    console.error('Website Generator Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Fehler beim Generieren der Website'
      })
    };
  }
};
