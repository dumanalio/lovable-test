// Utility-Funktionen
function $(id) { 
  return document.getElementById(id); 
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  // Erlaube nur HTTP(S) und Hash-Links
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
    return url;
  }
  return '#';
}

// Haupt-Render-Funktion
function renderPage(data) {
  const stage = $("stage");
  
  if (!data || !data.blocks || !Array.isArray(data.blocks)) {
    stage.innerHTML = `
      <div class="error-state">
        <h2>⚠️ Fehler beim Laden</h2>
        <p>Die Website-Daten konnten nicht geladen werden.</p>
      </div>
    `;
    return;
  }

  stage.innerHTML = "";
  const blocks = data.blocks;

  // Render jeden Block
  for (const block of blocks) {
    if (!block || !block.type) continue;

    try {
      switch (block.type) {
        case 'hero':
          renderHeroBlock(stage, block);
          break;
        case 'features':
          renderFeaturesBlock(stage, block);
          break;
        case 'faq':
          renderFaqBlock(stage, block);
          break;
        case 'form':
          renderFormBlock(stage, block);
          break;
        case 'text':
          renderTextBlock(stage, block);
          break;
        case 'gallery':
          renderGalleryBlock(stage, block);
          break;
        case 'testimonials':
          renderTestimonialsBlock(stage, block);
          break;
        case 'pricing':
          renderPricingBlock(stage, block);
          break;
        default:
          console.warn('Unbekannter Block-Typ:', block.type);
      }
    } catch (error) {
      console.error('Fehler beim Rendern von Block:', block.type, error);
      renderErrorBlock(stage, `Fehler beim Rendern des ${block.type}-Blocks`);
    }
  }

  // Wenn keine Blöcke gerendert wurden
  if (stage.innerHTML.trim() === '') {
    stage.innerHTML = `
      <div class="empty-state">
        <h2>🚀 Bereit zum Starten!</h2>
        <p>Beschreibe deine Wunsch-Website im Chat und ich erstelle sie für dich.</p>
      </div>
    `;
  }
}

// Block-Renderer
function renderHeroBlock(container, block) {
  const headline = escapeHtml(block.headline || 'Willkommen');
  const sub = escapeHtml(block.sub || '');
  const ctaText = escapeHtml(block.ctaText || 'Mehr erfahren');
  const ctaLink = sanitizeUrl(block.ctaLink || '#');

  const heroHtml = `
    <section class="hero">
      <h1>${headline}</h1>
      ${sub ? `<p>${sub}</p>` : ''}
      <a href="${ctaLink}">${ctaText}</a>
    </section>
  `;
  
  container.innerHTML += heroHtml;
}

function renderFeaturesBlock(container, block) {
  const items = block.items || [];
  
  if (items.length === 0) {
    return;
  }

  const featuresHtml = items.map(item => {
    const icon = escapeHtml(item.icon || '⭐');
    const title = escapeHtml(item.title || 'Feature');
    const text = escapeHtml(item.text || '');
    
    return `
      <div class="feature">
        <h3>${icon} ${title}</h3>
        ${text ? `<p>${text}</p>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML += `
    <section class="features">
      ${featuresHtml}
    </section>
  `;
}

function renderFaqBlock(container, block) {
  const items = block.items || [];
  
  if (items.length === 0) {
    return;
  }

  const title = escapeHtml(block.title || 'Häufig gestellte Fragen');

  const faqHtml = items.map(item => {
    const question = escapeHtml(item.q || item.question || '');
    const answer = escapeHtml(item.a || item.answer || '');
    
    if (!question || !answer) return '';
    
    return `
      <details>
        <summary>${question}</summary>
        <p>${answer}</p>
      </details>
    `;
  }).join('');

  container.innerHTML += `
    <section class="faq">
      <h2>${title}</h2>
      ${faqHtml}
    </section>
  `;
}

function renderFormBlock(container, block) {
  const title = escapeHtml(block.title || 'Kontakt');
  const fields = block.fields || [];
  const submitButtonText = escapeHtml(block.submitButtonText || 'Absenden');

  if (fields.length === 0) {
    return;
  }

  const fieldsHtml = fields.map((field, index) => {
    const label = escapeHtml(field.label || '');
    const type = field.type || 'text';
    const required = field.required ? 'required' : '';
    const fieldId = `form-field-${index}`;
    
    // Validiere Feld-Typ
    const allowedTypes = ['text', 'email', 'tel', 'number', 'textarea', 'select'];
    const fieldType = allowedTypes.includes(type) ? type : 'text';
    
    if (fieldType === 'textarea') {
      return `
        <label for="${fieldId}">
          ${label}
          <textarea id="${fieldId}" name="${fieldId}" ${required}></textarea>
        </label>
      `;
    } else if (fieldType === 'select' && field.options) {
      const options = field.options.map(option => 
        `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`
      ).join('');
      
      return `
        <label for="${fieldId}">
          ${label}
          <select id="${fieldId}" name="${fieldId}" ${required}>
            <option value="">Bitte wählen...</option>
            ${options}
          </select>
        </label>
      `;
    } else {
      return `
        <label for="${fieldId}">
          ${label}
          <input type="${fieldType}" id="${fieldId}" name="${fieldId}" ${required}>
        </label>
      `;
    }
  }).join('');

  container.innerHTML += `
    <section class="form">
      <h2>${title}</h2>
      <form onsubmit="handleFormSubmit(event)">
        ${fieldsHtml}
        <button type="submit">${submitButtonText}</button>
      </form>
    </section>
  `;
}

function renderTextBlock(container, block) {
  const title = block.title ? escapeHtml(block.title) : '';
  const content = block.content ? escapeHtml(block.content) : '';
  
  if (!title && !content) return;

  container.innerHTML += `
    <section class="text-block" style="padding: 40px; max-width: 800px; margin: 0 auto;">
      ${title ? `<h2 style="margin-bottom: 20px; color: #1e293b;">${title}</h2>` : ''}
      ${content ? `<div style="line-height: 1.6; color: #64748b;">${content.replace(/\n/g, '<br>')}</div>` : ''}
    </section>
  `;
}

function renderGalleryBlock(container, block) {
  const items = block.items || [];
  
  if (items.length === 0) return;

  const title = block.title ? escapeHtml(block.title) : '';
  
  const galleryHtml = items.map(item => {
    const src = sanitizeUrl(item.src || item.image || '');
    const alt = escapeHtml(item.alt || item.title || 'Bild');
    const caption = item.caption ? escapeHtml(item.caption) : '';
    
    return `
      <div class="gallery-item">
        <img src="${src}" alt="${alt}" loading="lazy">
        ${caption ? `<p class="gallery-caption">${caption}</p>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML += `
    <section class="gallery" style="padding: 60px 40px;">
      ${title ? `<h2 style="text-align: center; margin-bottom: 40px;">${title}</h2>` : ''}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        ${galleryHtml}
      </div>
    </section>
  `;
}

function renderTestimonialsBlock(container, block) {
  const items = block.items || [];
  
  if (items.length === 0) return;

  const title = block.title ? escapeHtml(block.title) : 'Was unsere Kunden sagen';
  
  const testimonialsHtml = items.map(item => {
    const text = escapeHtml(item.text || item.testimonial || '');
    const author = escapeHtml(item.author || item.name || '');
    const role = escapeHtml(item.role || item.position || '');
    
    return `
      <div class="testimonial" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-style: italic; margin-bottom: 20px; color: #64748b;">"${text}"</p>
        <div style="font-weight: 600; color: #1e293b;">${author}</div>
        ${role ? `<div style="font-size: 0.9rem; color: #64748b;">${role}</div>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML += `
    <section class="testimonials" style="padding: 60px 40px; background: #f8fafc;">
      <h2 style="text-align: center; margin-bottom: 40px;">${title}</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto;">
        ${testimonialsHtml}
      </div>
    </section>
  `;
}

function renderPricingBlock(container, block) {
  const items = block.items || [];
  
  if (items.length === 0) return;

  const title = block.title ? escapeHtml(block.title) : 'Preise';
  
  const pricingHtml = items.map(item => {
    const name = escapeHtml(item.name || item.title || '');
    const price = escapeHtml(item.price || '');
    const features = (item.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('');
    const ctaText = escapeHtml(item.ctaText || 'Wählen');
    const ctaLink = sanitizeUrl(item.ctaLink || '#');
    const popular = item.popular ? 'style="border: 2px solid #667eea; transform: scale(1.05);"' : '';
    
    return `
      <div class="pricing-card" ${popular} style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; position: relative;">
        ${item.popular ? '<div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #667eea; color: white; padding: 5px 20px; border-radius: 20px; font-size: 0.8rem;">Beliebt</div>' : ''}
        <h3 style="margin-bottom: 10px; color: #1e293b;">${name}</h3>
        <div style="font-size: 2rem; font-weight: 700; color: #667eea; margin-bottom: 20px;">${price}</div>
        <ul style="list-style: none; margin-bottom: 30px;">
          ${features}
        </ul>
        <a href="${ctaLink}" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">${ctaText}</a>
      </div>
    `;
  }).join('');

  container.innerHTML += `
    <section class="pricing" style="padding: 60px 40px;">
      <h2 style="text-align: center; margin-bottom: 40px;">${title}</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto;">
        ${pricingHtml}
      </div>
    </section>
  `;
}

function renderErrorBlock(container, message) {
  container.innerHTML += `
    <div style="padding: 40px; text-align: center; color: #dc2626;">
      <h3>⚠️ Fehler</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

// Form-Handler
function handleFormSubmit(event) {
  event.preventDefault();
  alert('Danke für deine Nachricht! (Dies ist nur eine Demo-Funktion)');
}

// Preview-Steuerung
function refreshPreview() {
  const currentData = window.currentWebsiteData;
  if (currentData) {
    renderPage(currentData);
  }
}

function toggleFullscreen() {
  const stage = $("stage");
  if (!document.fullscreenElement) {
    stage.requestFullscreen?.() || stage.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
}

// Event Listeners für Preview-Controls
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = $("refresh-preview");
  const fullscreenBtn = $("fullscreen-preview");
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshPreview);
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
});

// Globale Funktionen verfügbar machen
window.renderPage = renderPage;
window.handleFormSubmit = handleFormSubmit;
