document.getElementById("chat-send").addEventListener("click", async () => {
  const inputField = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const stage = document.getElementById("stage");

  const userText = inputField.value.trim();
  if (!userText) return;

  // User Nachricht anzeigen
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.textContent = "🧑: " + userText;
  log.appendChild(userMsg);
  inputField.value = "";

  // Anfrage an API
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: userText })
  });

  const data = await res.json();

  // Vorschau aktualisieren
  if (data.blocks) {
    stage.innerHTML = ""; // reset
    data.blocks.forEach(block => {
      if (block.type === "hero") {
        stage.innerHTML += `<section class="hero">
          <h1>${block.headline}</h1>
          <p>${block.sub}</p>
          <a href="${block.ctaLink}">${block.ctaText}</a>
        </section>`;
      }
      if (block.type === "features") {
        stage.innerHTML += `<section><h2>Features</h2>
          <ul>${block.items.map(i => `<li>${i.icon} <strong>${i.title}</strong>: ${i.text}</li>`).join("")}</ul>
        </section>`;
      }
      if (block.type === "faq") {
        stage.innerHTML += `<section><h2>${block.title}</h2>
          ${block.items.map(i => `<details><summary>${i.q}</summary><p>${i.a}</p></details>`).join("")}
        </section>`;
      }
      if (block.type === "form") {
        stage.innerHTML += `<section><h2>${block.title}</h2>
          <form>${block.fields.map(f => `
            <label>${f.label}: 
              <input type="${f.type}" ${f.required ? "required" : ""}/>
            </label><br>
          `).join("")}
          <button>${block.submitButtonText}</button></form>
        </section>`;
      }
    });
  }
});
