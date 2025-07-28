const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Load .env file from the parent directory (root of project)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Debug: Check if API key is loaded
console.log('Environment check:');
console.log('- OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
console.log('- OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
console.log('- OPENAI_API_KEY starts with sk-:', OPENAI_API_KEY ? OPENAI_API_KEY.startsWith('sk-') : false);

// Middleware
app.use(express.json());

// Serve static files (frontend) - fixed path to point to root public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Model handling functions
async function handleLlama3(userMessage) {
  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3',
        prompt: `You are a helpful chatbot. Answer the following question clearly:\n\n${userMessage}`,
        stream: false
      },
    );
    return response.data.response.trim();
  } catch (error) {
    console.error('Llama3 error:', error.response?.data || error.message);
    throw new Error('❌ Sorry, I could not reach TinyLlama. Please try again later.');
  }
}

async function handleGPT4(userMessage) {
  if (!OPENAI_API_KEY) {
    throw new Error('❌ OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.');
  }
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful chatbot. Answer questions clearly and concisely.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('GPT-4 error:', error.response?.data || error.message);
    throw new Error('❌ Sorry, I could not reach GPT-4. Please check your API key and try again.');
  }
}

async function handleMistral(userMessage) {
  // For now, using a mock response. In a real implementation, you would call the Mistral API
  try {
    // This is a placeholder - replace with actual Mistral API call when available
    const mockResponse = `This is a mock response from Mistral 7B for: "${userMessage}". In a real implementation, this would call the actual Mistral API.`;
    return mockResponse;
  } catch (error) {
    console.error('Mistral error:', error.message);
    throw new Error('❌ Mistral 7B is not yet implemented. Please try another model.');
  }
}

// Chat endpoint with multi-model support
app.post('/chat', async (req, res) => {
  const { message: userMessage, model = 'llama3' } = req.body;
  
  if (!userMessage) {
    return res.status(400).json({ reply: '❌ Please provide a message.' });
  }
  
  console.log(`User (${model}): ${userMessage}`);

  try {
    let botReply;
    
    switch (model) {
      case 'llama3':
        botReply = await handleLlama3(userMessage);
        break;
      case 'gpt4':
        botReply = await handleGPT4(userMessage);
        break;
      case 'mistral':
        botReply = await handleMistral(userMessage);
        break;
      default:
        // Default to LLaMA 3 if unsupported model
        console.warn(`Unsupported model: ${model}, defaulting to llama3`);
        botReply = await handleLlama3(userMessage);
        break;
    }
    
    res.json({ reply: botReply });
  } catch (error) {
    console.error(`Error with model ${model}:`, error.message);
    res.json({ reply: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
