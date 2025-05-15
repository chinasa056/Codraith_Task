// const { GoogleGenAI } = require('@google/genai');
// require('dotenv').config();

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// // Store per-user chat history in memory or DB
// let chatHistory = [];

// exports.handleAIChat = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   try {
//     chatHistory.push({ role: 'user', parts: [{ text: message }] });

//     const result = await model.generateContent({ contents: chatHistory });
//     const response = await result.response;
//     const botReply = await response.text();

//     chatHistory.push({ role: 'model', parts: [{ text: botReply }] });

//     res.json({ reply: botReply });
//   } catch (error) {
//     console.error('Gemini error:', error);
//     res.status(500).json({ error: 'AI failed to respond' });
//   }
// };


// const { GoogleGenAI } = require('@google/genai');
// require('dotenv').config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// exports.generateContent = async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required' });
//   }

//   try {
//     const response = await ai.models.generateContentStream({
//       model: 'gemini-2.0-flash-001',
//       contents: prompt,
//     });

//     let result = '';
//     for await (const chunk of response) {
//       result += chunk.text;
//     }

//     res.status(200).json({ response: result });
//   } catch (error) {
//     console.error('Gemini AI error:', error);
//     res.status(500).json({ error: 'Failed to generate AI response' });
//   }
// };


const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Helper to clean Markdown from AI output and remove unwanted sections like "Person:", "Place:"
const removeMarkdown = (text) => {
  let cleanedText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')      // bold
    .replace(/\*(.*?)\*/g, '$1')          // italic
    .replace(/_(.*?)_/g, '$1')            // underscore italic
    .replace(/^\s*[-*]\s*/gm, '')         // remove bullet points (starting with '*' or '-')
    .replace(/\(\*\)\s*/g, '')            // remove unwanted `*)`
    .replace(/\\n/g, '\n');               // unescape newlines (i.e., convert \n to actual line breaks)

  // Remove headings like "Person:", "Place:", "Thing:" etc.
  cleanedText = cleanedText.replace(/(Person|Place|Thing|Idea|Common|Proper|Concrete|Abstract|Countable|Uncountable|Collective):/g, '');

  // Remove extra empty lines or multiple line breaks
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n'); // Collapse multiple newlines

  return cleanedText.trim(); // Clean leading/trailing spaces
};

exports.generateContent = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }

    // Clean the response text
    const cleanedText = removeMarkdown(result);

    // Send back the cleaned text with proper newlines
    res.status(200).json({ response: cleanedText });
  } catch (error) {
    console.error('Gemini AI error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
};
