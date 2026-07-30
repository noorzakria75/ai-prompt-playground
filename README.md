# AI Prompt Playground

A lightweight, front-end-only playground for drafting and previewing AI prompts — built entirely with **HTML5, CSS3, and vanilla JavaScript**. No frameworks, no libraries, no backend.

![status](https://img.shields.io/badge/status-complete-8B7CFF) ![stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-35E7D7)

---

## Overview

**AI Prompt Playground** simulates the front-end experience of a simple AI tool: a user types a prompt, submits it, and sees it rendered in a formatted output card — complete with word count, character count, and a submission timestamp.

There is **no AI API connection**. The goal of this project is to demonstrate core JavaScript fundamentals — DOM manipulation, event handling, validation, and clean state management — inside a polished, modern interface.

This project was built as part of a daily AI/ML internship task, with a focus on production-quality front-end code suitable for a professional portfolio.

---

## Features

-  **Prompt input** — large, accessible textarea with helpful placeholder text
-  **Input validation** — rejects empty/whitespace-only prompts with a clear inline error
-  **Live signal meter** — a segmented character-count indicator that fills as you type
-  **Quick-start suggestions** — clickable example prompts, rendered dynamically from an array
-  **Output monitor** — displays the submitted prompt in a glass-style card, showing word count, character count, and submission time
-  **Replace, don't duplicate** — submitting a new prompt updates the existing card instead of stacking new ones
-  **Clear control** — resets the input field independently of the last output
-  **Fully responsive** — adapts cleanly across desktop, tablet, and mobile using Flexbox and CSS Grid
-  **Accessible by design** — semantic HTML, associated labels, visible focus states, and `aria-live` error messaging

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure and accessibility |
| CSS3 | Glassmorphism UI, gradients, Grid/Flexbox responsive layout |
| Vanilla JavaScript (ES6+) | DOM manipulation, validation, state, and interactivity |
| Google Fonts | Space Grotesk, Inter, JetBrains Mono |

No Bootstrap, Tailwind, React, Vue, or any external JS library is used.

---

## Learning Objectives

This project was built to demonstrate practical, hands-on use of:

- Variables (`let` and `const`) and core data types
- Operators (comparison, logical, ternary)
- Conditionals (`if` / `else if` / `else`)
- Loops (`for`, `for...of`)
- Functions, including ones that return objects
- Arrays (mapping example prompts to UI chips)
- Objects (structuring submitted-prompt data)
- DOM manipulation (creating, updating, showing/hiding elements)
- Event listeners (`submit`, `input`, `click`, event delegation)
- A basic introduction to the **Fetch API**, included as a commented, unused placeholder for future AI integration

---

## Folder Structure

```
ai-prompt-playground/
├── index.html      # Semantic markup and page structure
├── style.css        # Design tokens, layout, and glassmorphism styling
├── script.js        # All application logic, organized into labeled sections
└── README.md        # Project documentation (this file)
```

---

## How to Run

No build tools or installation required.

1. Download or clone this repository.
2. Open `index.html` directly in any modern browser.

That's it — the entire app runs client-side.

---

## Future Improvements

- Wire up the existing `fetch` placeholder to a real AI text-generation API
- Add a prompt history panel with the ability to revisit past submissions
- Add light/dark theme toggle
- Persist the last submitted prompt using `localStorage`

---

## Author

Built as part of a daily AI/ML internship task series.

## License

This project is open source and available under the [MIT License](LICENSE).
