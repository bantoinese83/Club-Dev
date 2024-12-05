import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not set in the environment variables');
}

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

export const getGeminiVisionModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro-vision" });
};

export const generateMindMap = async (topic: string) => {
  const model = getGeminiModel();
  const prompt = `Generate a mind map for the topic: "${topic}". 
Format the output as a hierarchical structure with main topics and subtopics. 
Use indentation to represent the hierarchy. 
For example:
Main Topic
  Subtopic 1
    Sub-subtopic A
    Sub-subtopic B
  Subtopic 2
    Sub-subtopic C
    Sub-subtopic D
Limit the output to 3 levels of depth and up to 15 total nodes.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

