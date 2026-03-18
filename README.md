# 🧠 Smart Gemini Browser

A lightweight, AI-powered search interface that leverages the **Google Gemini API** to provide comprehensive, easily digestible answers. Built with a strong focus on User Experience (UX) and clean code architecture, this project transforms standard API responses into a rich, interactive web experience.

![Smart Gemini Browser Preview](https://via.placeholder.com/800x400?text=Smart+Gemini+Browser+Preview) *(Note: Add your own screenshot here and replace this link)*

## ✨ Key Features

* **🤖 AI-Powered Intelligence:** Integrated with the `gemini-1.5-flash-latest` model for fast and accurate text generation.
* **🎤 Voice Search Capability:** Utilizes the native Web Speech API, allowing users to search hands-free using voice commands.
* **📝 Rich Text Rendering:** Implements `marked.js` to parse AI-generated Markdown into clean, readable HTML (Headings, Lists, Links).
* **🚀 Seamless UX:** Features intuitive **Copy to Clipboard** and **Native Web Share** functionalities for quick information distribution.
* **🛡️ Robust Error Handling:** Built with optional chaining (`?.`) and explicit `try...catch` blocks to gracefully handle API limits, network errors, and unsupported browser features.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Bootstrap 5 for responsive UI)
* **Logic:** Vanilla JavaScript (ES6+), Async/Await, Promises
* **APIs:** Google Gemini API (REST via `fetch`), Web Speech API, Clipboard API, Web Share API
* **Libraries:** `marked.js`

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/smart-gemini-browser.git](https://github.com/yourusername/smart-gemini-browser.git)