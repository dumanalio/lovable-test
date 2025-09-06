{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Website Generation Schema for generate.js",
  "description": "This schema defines the structured data format that generate.js expects as input to build a website. It is the machine-readable translation of the user's chat input.",
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "description": "High-level information about the website.",
      "properties": {
        "purpose": {
          "type": "string",
          "description": "The primary goal of the website (e.g., 'e-commerce', 'portfolio', 'lead-generation')."
        },
        "targetAudience": {
          "type": "string",
          "description": "A description of the intended audience."
        },
        "mainCTA": {
          "type": "object",
          "properties": {
            "text": { "type": "string" },
            "action": { "type": "string", "description": "e.g., 'navigate', 'open_modal'" },
            "target": { "type": "string", "description": "URL or modal ID" }
          }
        },
        "domainName": {
          "type": "string",
          "description": "The desired domain name for the website."
        },
        "seoKeywords": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["purpose", "targetAudience"]
    },
    "design": {
      "type": "object",
      "description": "Visual styling and branding guidelines.",
      "properties": {
        "aesthetic": {
          "type": "string",
          "description": "Overall style (e.g., 'modern', 'minimalist', 'corporate')."
        },
        "palette": {
          "type": "object",
          "properties": {
            "primary": { "type": "string", "format": "color" },
            "secondary": { "type": "string", "format": "color" },
            "accent": { "type": "string", "format": "color" },
            "text": { "type": "string", "format": "color" },
            "background": { "type": "string", "format": "color" }
          }
        },
        "typography": {
          "type": "object",
          "properties": {
            "headingFont": { "type": "string" },
            "bodyFont": { "type": "string" }
          }
        },
        "logo": {
          "type": "object",
          "properties": {
            "src": { "type": "string", "format": "uri" },
            "alt": { "type": "string" }
          }
        }
      },
      "required": ["aesthetic", "palette", "typography"]
    },
    "structure": {
      "type": "array",
      "description": "The pages and their content structure.",
      "items": {
        "$ref": "#/definitions/page"
      }
    }
  },
  "required": ["metadata", "design", "structure"],
  "definitions": {
    "page": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier for the page (e.g., 'home', 'about-us')." },
        "title": { "type": "string" },
        "path": { "type": "string", "description": "URL path for the page (e.g., '/', '/about')." },
        "sections": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/section"
          }
        }
      },
      "required": ["id", "title", "path", "sections"]
    },
    "section": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["hero", "text", "image", "gallery", "cta", "form", "team", "testimonials", "faq", "map", "social-media", "custom"] },
        "content": {
          "type": "object",
          "description": "Content specific to the section type.",
          "oneOf": [
            {
              "if": { "properties": { "type": { "const": "hero" } } },
              "then": {
                "properties": {
                  "headline": { "type": "string" },
                  "subheadline": { "type": "string" },
                  "image": { "type": "string", "format": "uri" },
                  "cta": { "type": "object", "properties": { "text": { "type": "string" }, "link": { "type": "string", "format": "uri" } } }
                },
                "required": ["headline"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "text" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "body": { "type": "string" }
                },
                "required": ["body"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "image" } } },
              "then": {
                "properties": {
                  "src": { "type": "string", "format": "uri" },
                  "alt": { "type": "string" },
                  "caption": { "type": "string" }
                },
                "required": ["src"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "gallery" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "images": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "src": { "type": "string", "format": "uri" },
                        "alt": { "type": "string" }
                      },
                      "required": ["src"]
                    }
                  }
                },
                "required": ["images"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "cta" } } },
              "then": {
                "properties": {
                  "text": { "type": "string" },
                  "link": { "type": "string", "format": "uri" },
                  "description": { "type": "string" }
                },
                "required": ["text", "link"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "form" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "fields": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "label": { "type": "string" },
                        "type": { "type": "string", "enum": ["text", "email", "textarea", "checkbox"] },
                        "required": { "type": "boolean" }
                      },
                      "required": ["label", "type"]
                    }
                  },
                  "submitButtonText": { "type": "string" }
                },
                "required": ["fields"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "team" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "members": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": { "type": "string" },
                        "role": { "type": "string" },
                        "bio": { "type": "string" },
                        "image": { "type": "string", "format": "uri" }
                      },
                      "required": ["name"]
                    }
                  }
                },
                "required": ["members"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "testimonials" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "quotes": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "quote": { "type": "string" },
                        "author": { "type": "string" },
                        "source": { "type": "string" }
                      },
                      "required": ["quote", "author"]
                    }
                  }
                },
                "required": ["quotes"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "faq" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "question": { "type": "string" },
                        "answer": { "type": "string" }
                      },
                      "required": ["question", "answer"]
                    }
                  }
                },
                "required": ["items"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "map" } } },
              "then": {
                "properties": {
                  "address": { "type": "string" },
                  "latitude": { "type": "number" },
                  "longitude": { "type": "number" }
                },
                "required": ["address"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "social-media" } } },
              "then": {
                "properties": {
                  "title": { "type": "string" },
                  "links": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "platform": { "type": "string" },
                        "url": { "type": "string", "format": "uri" }
                      },
                      "required": ["platform", "url"]
                    }
                  }
                },
                "required": ["links"]
              }
            },
            {
              "if": { "properties": { "type": { "const": "custom" } } },
              "then": {
                "properties": {
                  "html": { "type": "string" },
                  "css": { "type": "string" },
                  "js": { "type": "string" }
                },
                "required": ["html"]
              }
            }
          ]
        }
      },
      "required": ["type", "content"]
    }
  }
}

Anweisungen zur JSON-Generierung

1.
Analysieren Sie die Benutzeranfrage: Lesen Sie die gesamte Konversation mit dem Benutzer sorgfältig durch, um alle Details zur gewünschten Website zu erfassen.

2.
Füllen Sie die metadata aus:

•
purpose: Extrahieren Sie den Hauptzweck der Website. Wählen Sie aus den Beispielen oder leiten Sie einen passenden Zweck ab.

•
targetAudience: Beschreiben Sie die Zielgruppe basierend auf den Benutzerangaben.

•
mainCTA: Identifizieren Sie den primären Call-to-Action, seinen Text, die Aktion (z.B. navigate für Links, open_modal für Pop-ups) und das Ziel (URL oder ID).

•
domainName: Wenn der Benutzer einen Domainnamen erwähnt, fügen Sie ihn hier ein.

•
seoKeywords: Sammeln Sie alle relevanten Schlüsselwörter oder Phrasen, die der Benutzer für SEO genannt hat.



3.
Füllen Sie das design-Objekt aus:

•
aesthetic: Beschreiben Sie den gewünschten Gesamtstil der Website.

•
palette: Extrahieren Sie die Farbpräferenzen des Benutzers. Wenn Hex-Codes angegeben sind, verwenden Sie diese. Andernfalls versuchen Sie, die Farben so genau wie möglich zu beschreiben (z.B. 'dunkelblau', 'hellgrau').

•
typography: Identifizieren Sie die bevorzugten Schriftarten für Überschriften und Fließtext. Wenn spezifische Schriftnamen genannt werden, verwenden Sie diese.

•
logo: Wenn ein Logo beschrieben oder ein Platzhalter erwähnt wird, füllen Sie src (falls URL verfügbar) und alt aus.



4.
Strukturieren Sie die structure (Seiten und Sektionen):

•
Iterieren Sie über jede vom Benutzer gewünschte Seite.

•
Für jede Seite erstellen Sie ein page-Objekt mit id (kleingeschrieben, Bindestriche für Leerzeichen), title und path.

•
Innerhalb jeder Seite, erstellen Sie ein Array von sections.

•
Für jede Sektion identifizieren Sie den type (z.B. hero, text, image, form, gallery, cta, team, testimonials, faq, map, social-media, custom).

•
Füllen Sie das content-Objekt der Sektion basierend auf dem type und den Benutzerangaben aus. Achten Sie darauf, alle required Felder für den jeweiligen Sektionstyp zu befüllen.

•
hero: headline, subheadline, image (URL), cta (text, link).

•
text: title, body (der Haupttext).

•
image: src (URL), alt, caption.

•
gallery: title, images (Array von Objekten mit src und alt).

•
cta: text, link (URL), description.

•
form: title, fields (Array von Objekten mit label, type (text, email, textarea, checkbox), required), submitButtonText.

•
team: title, members (Array von Objekten mit name, role, bio, image (URL)).

•
testimonials: title, quotes (Array von Objekten mit quote, author, source).

•
faq: title, items (Array von Objekten mit question, answer).

•
map: address, latitude, longitude.

•
social-media: title, links (Array von Objekten mit platform, url).

•
custom: html, css, js (für benutzerdefinierten Code, falls vom Benutzer bereitgestellt).





5.
Umgang mit fehlenden Informationen: Wenn der Benutzer bestimmte Informationen nicht explizit genannt hat, aber das Schema ein Feld als required markiert, versuchen Sie, einen sinnvollen Standardwert abzuleiten oder lassen Sie das Feld weg, wenn es nicht required ist. **Generieren Sie niemals Platzhalter wie

„[HIER TEXT EINFÜGEN]“ oder „[BILD PLATZHALTER]“. Lassen Sie das Feld einfach weg, wenn es nicht zwingend erforderlich ist, oder versuchen Sie, eine plausible Annahme zu treffen, die später vom Benutzer korrigiert werden kann.
6.  Validierung: Stellen Sie sicher, dass das generierte JSON-Objekt dem bereitgestellten Schema entspricht, bevor Sie es ausgeben.

Beispiel einer Benutzereingabe und erwartetes JSON-Output

Benutzereingabe:
"Ich brauche eine einfache Portfolio-Website. Eine Startseite mit meinem Namen und ein paar meiner besten Projekte. Dann eine 'Über mich'-Seite mit meiner Bio und ein Kontaktformular. Das Design soll modern und minimalistisch sein, mit einer Farbpalette aus Weiß, Grau und einem Akzent in Türkis. Schriftarten sollen serifenlos sein. Mein Name ist Max Mustermann. Meine E-Mail ist max@example.com. Ich möchte, dass die Leute mich kontaktieren können. Meine Projekte sind 'Projekt A' und 'Projekt B'."

Erwartetes JSON-Output (Beispiel, gekürzt):

JSON


{
  "metadata": {
    "purpose": "portfolio",
    "targetAudience": "potential clients, recruiters",
    "mainCTA": {
      "text": "Kontakt aufnehmen",
      "action": "navigate",
      "target": "/kontakt"
    },
    "domainName": "",
    "seoKeywords": ["Max Mustermann", "Portfolio", "Webdesign"]
  },
  "design": {
    "aesthetic": "modern, minimalist",
    "palette": {
      "primary": "#FFFFFF",
      "secondary": "#F0F0F0",
      "accent": "#40E0D0",
      "text": "#333333",
      "background": "#FFFFFF"
    },
    "typography": {
      "headingFont": "sans-serif",
      "bodyFont": "sans-serif"
    },
    "logo": {
      "src": "",
      "alt": ""
    }
  },
  "structure": [
    {
      "id": "home",
      "title": "Startseite",
      "path": "/",
      "sections": [
        {
          "type": "hero",
          "content": {
            "headline": "Max Mustermann",
            "subheadline": "Mein Portfolio",
            "image": "",
            "cta": {
              "text": "Meine Projekte",
              "link": "/projekte"
            }
          }
        },
        {
          "type": "gallery",
          "content": {
            "title": "Meine Projekte",
            "images": [
              {
                "src": "/images/projekt-a.jpg",
                "alt": "Projekt A"
              },
              {
                "src": "/images/projekt-b.jpg",
                "alt": "Projekt B"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "about-me",
      "title": "Über mich",
      "path": "/ueber-mich",
      "sections": [
        {
          "type": "text",
          "content": {
            "title": "Über Max Mustermann",
            "body": "Hier kommt die Bio von Max Mustermann hin."
          }
        }
      ]
    },
    {
      "id": "contact",
      "title": "Kontakt",
      "path": "/kontakt",
      "sections": [
        {
          "type": "form",
          "content": {
            "title": "Kontaktieren Sie mich",
            "fields": [
              {
                "label": "Name",
                "type": "text",
                "required": true
              },
              {
                "label": "E-Mail",
                "type": "email",
                "required": true
              },
              {
                "label": "Nachricht",
                "type": "textarea",
                "required": true
              }
            ],
            "submitButtonText": "Senden"
          }
        }
      ]
    }
  ]
}


