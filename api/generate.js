{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Website Generation Schema for generate.js",
  "description": "Structured data format that generate.js expects to build a website from natural language.",
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "description": "High-level information about the website.",
      "properties": {
        "purpose": {
          "type": "string",
          "description": "Primary goal of the website (e.g., 'e-commerce', 'portfolio', 'lead-generation')."
        },
        "targetAudience": {
          "type": "string",
          "description": "Intended audience description."
        },
        "mainCTA": {
          "type": "object",
          "properties": {
            "text": { "type": "string" },
            "action": { "type": "string", "description": "e.g., 'navigate', 'open_modal'" },
            "target": { "type": "string", "description": "URL or modal ID" }
          },
          "required": ["text"]
        },
        "domainName": { "type": "string" },
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
        "aesthetic": { "type": "string" },
        "palette": {
          "type": "object",
          "properties": {
            "primary": { "type": "string" },
            "secondary": { "type": "string" },
            "accent": { "type": "string" },
            "text": { "type": "string" },
            "background": { "type": "string" }
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
            "src": { "type": "string" },
            "alt": { "type": "string" }
          }
        }
      },
      "required": ["aesthetic", "palette", "typography"]
    },
    "structure": {
      "type": "array",
      "description": "The pages and their content structure.",
      "items": { "$ref": "#/definitions/page" },
      "minItems": 1
    }
  },
  "required": ["metadata", "design", "structure"],
  "definitions": {
    "page": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier, e.g. 'home', 'about-us'." },
        "title": { "type": "string" },
        "path": { "type": "string", "description": "URL path (e.g., '/', '/about')." },
        "sections": {
          "type": "array",
          "items": { "$ref": "#/definitions/section" },
          "minItems": 1
        }
      },
      "required": ["id", "title", "path", "sections"],
      "additionalProperties": false
    },
    "section": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "type": { "const": "hero" },
            "content": {
              "type": "object",
              "properties": {
                "headline": { "type": "string" },
                "subheadline": { "type": "string" },
                "image": { "type": "string" },
                "cta": {
                  "type": "object",
                  "properties": {
                    "text": { "type": "string" },
                    "link": { "type": "string" }
                  },
                  "required": ["text", "link"],
                  "additionalProperties": false
                }
              },
              "required": ["headline"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "text" },
            "content": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "body": { "type": "string" }
              },
              "required": ["body"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "image" },
            "content": {
              "type": "object",
              "properties": {
                "src": { "type": "string" },
                "alt": { "type": "string" },
                "caption": { "type": "string" }
              },
              "required": ["src"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "gallery" },
            "content": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "images": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "src": { "type": "string" },
                      "alt": { "type": "string" }
                    },
                    "required": ["src"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                }
              },
              "required": ["images"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "cta" },
            "content": {
              "type": "object",
              "properties": {
                "text": { "type": "string" },
                "link": { "type": "string" },
                "description": { "type": "string" }
              },
              "required": ["text", "link"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "form" },
            "content": {
              "type": "object",
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
                    "required": ["label", "type"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                },
                "submitButtonText": { "type": "string" }
              },
              "required": ["fields"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "team" },
            "content": {
              "type": "object",
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
                      "image": { "type": "string" }
                    },
                    "required": ["name"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                }
              },
              "required": ["members"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "testimonials" },
            "content": {
              "type": "object",
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
                    "required": ["quote", "author"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                }
              },
              "required": ["quotes"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "faq" },
            "content": {
              "type": "object",
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
                    "required": ["question", "answer"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                }
              },
              "required": ["items"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "map" },
            "content": {
              "type": "object",
              "properties": {
                "address": { "type": "string" },
                "latitude": { "type": "number" },
                "longitude": { "type": "number" }
              },
              "required": ["address"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "social-media" },
            "content": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "links": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "platform": { "type": "string" },
                      "url": { "type": "string" }
                    },
                    "required": ["platform", "url"],
                    "additionalProperties": false
                  },
                  "minItems": 1
                }
              },
              "required": ["links"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "custom" },
            "content": {
              "type": "object",
              "properties": {
                "html": { "type": "string" },
                "css": { "type": "string" },
                "js": { "type": "string" }
              },
              "required": ["html"],
              "additionalProperties": false
            }
          },
          "required": ["type", "content"],
          "additionalProperties": false
        }
      ]
    }
  },
  "additionalProperties": false
}
