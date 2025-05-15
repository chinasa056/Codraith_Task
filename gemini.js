const { GoogleGenAI } = require('@google/genai');
require('dotenv').config(); 


// const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY});

//  const main = async () =>  {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Describe the planet earth in two words?",
//   });
// //   console.log("ai response", ai);
  
//   console.log(response.text);
// }

//  main();

//  import {GoogleGenAI} from '@google/genai';
 const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
 
 const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
 
 async function main() {
   const response = await ai.models.generateContentStream({
     model: 'gemini-2.0-flash-001',
     contents: 'what is a noun.',
   });
   for await (const chunk of response) {
     console.log(chunk.text);
   }
 }
 
 main();