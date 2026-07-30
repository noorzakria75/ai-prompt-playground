/* =========================================================
   AI PROMPT PLAYGROUND — SCRIPT.JS
   Vanilla JavaScript only. No frameworks, no external libraries.

   This file is organized into clearly labeled sections:
     1. DOM references
     2. Data (arrays & objects)
     3. Helper / utility functions
     4. Feature functions (chips, signal meter, validation, output)
     5. Event listeners
     6. Fetch API placeholder (NOT called — for future AI integration)
     7. Init
   ========================================================= */

/* ---------------------------------------------------------
   1. DOM REFERENCES
   We grab every element we'll touch once, up front, and store
   them in `const` variables so the rest of the file stays
   readable (no repeated document.getElementById calls).
--------------------------------------------------------- */
const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const promptError = document.getElementById("promptError");
const clearBtn = document.getElementById("clearBtn");
const chipRow = document.getElementById("chipRow");
const signalBars = document.getElementById("signalBars");
const signalCaption = document.getElementById("signalCaption");
const statusBadge = document.getElementById("statusBadge");

const emptyState = document.getElementById("emptyState");
const outputCard = document.getElementById("outputCard");
const outputText = document.getElementById("outputText");
const metaWords = document.getElementById("metaWords");
const metaChars = document.getElementById("metaChars");
const metaTime = document.getElementById("metaTime");

/* ---------------------------------------------------------
   2. DATA
   Config lives in one object so "magic numbers" aren't
   scattered through the file. The examples array powers the
   quick-start suggestion chips.
--------------------------------------------------------- */

// `const` because the object reference never changes, even
// though we only ever read its properties here.
const CONFIG = {
  maxChars: 500,      // total characters tracked by the signal meter
  barCount: 20,       // number of segments drawn in the signal meter
};

// Array of example prompt strings. Looped over below to build
// the clickable suggestion chips.
const EXAMPLE_PROMPTS = [
  "Explain quantum computing using a baking analogy",
  "Write a haiku about debugging code at midnight",
  "Summarize the water cycle for a 5th grader",
  "Suggest 3 names for a plant-care mobile app",
];

/* ---------------------------------------------------------
   3. HELPER / UTILITY FUNCTIONS
--------------------------------------------------------- */

/**
 * Counts words in a string.
 * Demonstrates: string methods, arrays, conditionals (ternary).
 * @param {string} text
 * @returns {number} word count
 */
function countWords(text) {
  const trimmed = text.trim();
  // Splitting an empty string still returns an array with one
  // empty item, so we guard against that with a ternary.
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/**
 * Returns the current time formatted as HH:MM:SS.
 * Demonstrates: Date object, template literals, padStart.
 * @returns {string}
 */
function getFormattedTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Updates the small status pill in the top bar.
 * Demonstrates: conditionals, classList manipulation.
 * @param {"idle" | "active" | "error"} state
 */
function setStatusBadge(state) {
  // Reset classes first, then add the one that matches the state.
  statusBadge.classList.remove("is-active", "is-error");

  let label = "Idle";

  if (state === "active") {
    label = "Prompt Ready";
    statusBadge.classList.add("is-active");
  } else if (state === "error") {
    label = "Needs Input";
    statusBadge.classList.add("is-error");
  }

  // The badge has a dot span + text node; we only want to replace
  // the text, so we target the last child text node via textContent
  // on a wrapping approach: simplest is to rebuild safely.
  statusBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${label}`;
}

/* ---------------------------------------------------------
   4. FEATURE FUNCTIONS
--------------------------------------------------------- */

/**
 * Builds the quick-start suggestion chips from EXAMPLE_PROMPTS.
 * Demonstrates: for...of loop, DOM creation, event delegation.
 */
function renderSuggestionChips() {
  // Loop over the array and create one button per example.
  for (const example of EXAMPLE_PROMPTS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = example;
    chipRow.appendChild(chip);
  }

  // Event delegation: one listener on the parent handles clicks
  // from every chip, including ones added later.
  chipRow.addEventListener("click", (event) => {
    const clickedChip = event.target.closest(".chip");
    if (!clickedChip) return; // ignore clicks that aren't on a chip

    promptInput.value = clickedChip.textContent;
    promptInput.focus();
    updateSignalMeter(promptInput.value.length);
    clearError();
  });
}

/**
 * Renders the segmented "signal strength" meter based on how many
 * characters have been typed relative to CONFIG.maxChars.
 * Demonstrates: loops, arrays, conditionals, operators.
 * @param {number} length current character count
 */
function updateSignalMeter(length) {
  // Clear any previously rendered bars.
  signalBars.innerHTML = "";

  const percentFilled = length / CONFIG.maxChars;
  const litCount = Math.round(percentFilled * CONFIG.barCount);
  const isOverLimit = length > CONFIG.maxChars;

  // Build an array of bar elements with a simple for loop, then
  // decide each bar's state with a conditional.
  for (let i = 0; i < CONFIG.barCount; i++) {
    const bar = document.createElement("span");

    if (isOverLimit) {
      bar.classList.add("is-over");
    } else if (i < litCount) {
      bar.classList.add("is-lit");
    }

    signalBars.appendChild(bar);
  }

  signalCaption.textContent = `${length} / ${CONFIG.maxChars} characters`;
}

/**
 * Validates a raw prompt string.
 * Demonstrates: functions returning objects, trimming, conditionals.
 * @param {string} rawValue
 * @returns {{ valid: boolean, message: string, cleanValue: string }}
 */
function validatePrompt(rawValue) {
  const cleanValue = rawValue.trim();

  if (cleanValue === "") {
    return {
      valid: false,
      message: "Please enter a prompt before submitting — the field can't be empty.",
      cleanValue,
    };
  }

  if (cleanValue.length > CONFIG.maxChars) {
    return {
      valid: false,
      message: `Your prompt is ${cleanValue.length - CONFIG.maxChars} characters over the ${CONFIG.maxChars}-character limit.`,
      cleanValue,
    };
  }

  return { valid: true, message: "", cleanValue };
}

/**
 * Displays a validation error to the user.
 * @param {string} message
 */
function showError(message) {
  promptError.textContent = message;
  promptInput.classList.add("is-invalid");
  setStatusBadge("error");
}

/**
 * Clears any currently displayed validation error.
 */
function clearError() {
  promptError.textContent = "";
  promptInput.classList.remove("is-invalid");
}

/**
 * Renders a submitted prompt inside the output card.
 * Demonstrates: object literals, DOM manipulation, template usage.
 * @param {string} text the cleaned prompt text
 */
function displayPrompt(text) {
  // Group everything about this submission into one object.
  // (This is the kind of structure a real API response might use.)
  const promptData = {
    text,
    wordCount: countWords(text),
    charCount: text.length,
    submittedAt: getFormattedTime(),
  };

  outputText.textContent = promptData.text;
  metaWords.textContent = promptData.wordCount;
  metaChars.textContent = promptData.charCount;
  metaTime.textContent = promptData.submittedAt;

  // Swap the empty state out for the output card. Because we
  // reuse the same card and just update its content, submitting
  // a second prompt replaces the first rather than duplicating it.
  emptyState.hidden = true;
  outputCard.hidden = false;

  setStatusBadge("active");
}

/* ---------------------------------------------------------
   5. EVENT LISTENERS
--------------------------------------------------------- */

// Live character count as the user types.
promptInput.addEventListener("input", () => {
  updateSignalMeter(promptInput.value.length);

  // If the user starts fixing an error, clear it as soon as
  // there's content again.
  if (promptInput.value.trim() !== "") {
    clearError();
  }
});

// Form submission: validate, then either show an error or render
// the prompt.
promptForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const result = validatePrompt(promptInput.value);

  if (!result.valid) {
    showError(result.message);
    return;
  }

  clearError();
  displayPrompt(result.cleanValue);
});

// Clear button: resets the textarea, meter, and any error — but
// intentionally leaves the last submitted output card in place,
// since "Clear" describes the input field, not the output.
clearBtn.addEventListener("click", () => {
  promptInput.value = "";
  promptInput.focus();
  clearError();
  updateSignalMeter(0);
  setStatusBadge("idle");
});

/* ---------------------------------------------------------
   6. FETCH API — PLACEHOLDER ONLY (never called)
   This function shows how a real AI request *would* be wired up
   in the future. It is intentionally never invoked, so the app
   stays fully front-end-only per the project requirements.
--------------------------------------------------------- */
/*
async function fetchAIResponse(promptText) {
  try {
    const response = await fetch("https://api.example.com/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("AI request failed:", error);
    return null;
  }
}
*/

/* ---------------------------------------------------------
   7. INIT
   Runs once on page load to set up the initial UI state.
--------------------------------------------------------- */
function init() {
  renderSuggestionChips();
  updateSignalMeter(0);
  setStatusBadge("idle");
}

init();
