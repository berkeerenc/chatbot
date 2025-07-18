# 🤖 AI-Powered Chatbot

A modern, web-based chatbot that can answer user questions through either a predefined FAQ system or by leveraging the power of OpenAI’s GPT models for dynamic, intelligent conversations.  
This project is designed to demonstrate how to build a clean, user-friendly chatbot interface, connect it with a Node.js backend, and integrate AI capabilities seamlessly into a web application.

---

## 📖 About

The AI-Powered Chatbot is a learning-focused internship project that explores the design and development of intelligent conversational systems.  
It combines a **static FAQ response mechanism** — useful for answering frequently asked questions — with a **dynamic AI engine** that generates natural, human-like responses when needed.

The chatbot interface is intuitive, responsive, and runs entirely in the browser, while the backend handles user queries, fetches answers, and communicates with OpenAI’s API when necessary.

---

## ✨ Features

### 🔷 Dual Response Modes
- 📄 **FAQ Mode**: Quickly responds to common, predefined questions from a curated list.
- 🧠 **AI Mode**: Sends the user’s question to OpenAI’s GPT model and returns a creative, context-aware answer.

### 🔷 Clean and Responsive Web Interface
- Minimalistic chat window, styled with modern CSS.
- Distinct styling for user and bot messages for clarity.
- Works well on both desktop and mobile browsers.

### 🔷 Seamless Backend Integration
- Built with Node.js and Express for handling HTTP requests.
- Routes user messages to either the FAQ or the AI engine.
- Uses environment variables to keep sensitive information (like API keys) secure.

### 🔷 Intelligent and Human-Like Conversations
- When FAQ answers are insufficient, the bot generates dynamic answers that feel natural and human, thanks to OpenAI GPT models.

### 🔷 Developer-Friendly Structure
- Clear, modular project structure separating frontend and backend.
- Environment variable support for easy deployment and better security.
- Easily extendable to include additional features like authentication, analytics, or logging.

---

## 🗂️ Project Structure

```
chatbot-project/
├── public/
│   ├── index.html       # Frontend interface
│   ├── style.css        # Styling for the interface
│   └── script.js        # Client-side chat logic
├── server.js            # Backend server logic
├── package.json         # Project metadata & dependencies
├── .env                 # Environment variables (not tracked)
├── .gitignore           # Git exclusions
├── README.md            # Project documentation
```

---

## 👨‍💻 Author

Made with as an internship learning project to explore full-stack development, chatbot design, and AI integration.

---
