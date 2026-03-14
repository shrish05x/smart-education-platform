const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Tutor Chat
 * @param {Array} messages - Chat history [{role, content}]
 * @returns {string} AI response
 */
const chatWithTutor = async (messages) => {
  try {
    const systemMessage = {
      role: 'system',
      content: `You are an intelligent AI tutor on the Smart Education Platform. 
      Your role is to help students learn effectively by:
      - Explaining concepts clearly and step-by-step
      - Providing examples and analogies
      - Asking follow-up questions to check understanding
      - Adapting your teaching style to the student's level
      Be encouraging, patient, and thorough in your explanations.`,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages.map((m) => ({ role: m.role, content: m.content }))],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Tutor Error:', error.message);
    return 'I apologize, but I am unable to process your request right now. Please try again later.';
  }
};

/**
 * Resource Recommendation
 * @param {string} topic - The topic to get recommendations for
 * @param {string} level - Student level (beginner, intermediate, advanced)
 * @returns {string} Recommendations
 */
const getRecommendations = async (topic, level = 'intermediate') => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an educational resource recommender. Provide structured learning resource recommendations including books, online courses, videos, and practice exercises.',
        },
        {
          role: 'user',
          content: `Recommend learning resources for "${topic}" at the ${level} level. Include a mix of free and paid resources. Format as a structured list.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Recommendation Error:', error.message);
    return 'Unable to generate recommendations at this time. Please try again later.';
  }
};

/**
 * Resume Analyzer
 * @param {string} resumeText - The resume text to analyze
 * @returns {string} Analysis and suggestions
 */
const analyzeResume = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer and career advisor. Analyze resumes and provide constructive feedback including strengths, weaknesses, suggestions for improvement, and ATS optimization tips.',
        },
        {
          role: 'user',
          content: `Please analyze this resume and provide detailed feedback:\n\n${resumeText}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Resume Analysis Error:', error.message);
    return 'Unable to analyze resume at this time. Please try again later.';
  }
};

module.exports = { chatWithTutor, getRecommendations, analyzeResume };
