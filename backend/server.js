const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Simple POST endpoint for chatbot (we'll implement logic later)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log(`User: ${userMessage}`);

  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3',
        prompt: `You are a helpful chatbot. Answer the following question clearly:\n\n${userMessage}`,
        stream: false
      },
    );

    const botReply = response.data.response.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.json({ reply: '❌ Sorry , I coult not reach Tinyllama. Please try again later' })
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
