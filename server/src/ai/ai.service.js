const isGeminiEnabled = () => Boolean(process.env.GEMINI_API_KEY);

/**
 * Call the Gemini API using the Google AI Generative Language REST endpoint.
 *
 * @param {string} systemInstruction - System-level instruction for the model.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} contents - The conversation contents.
 * @param {object} [generationConfig] - Optional generation config overrides.
 * @returns {Promise<string>} - The model's text response.
 */
const callGemini = async (systemInstruction, contents, generationConfig = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents,
    generationConfig: {
      temperature: generationConfig.temperature ?? 0.7,
      maxOutputTokens: generationConfig.maxOutputTokens ?? 1024,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  );
};

/**
 * AI Tutor Chat
 * @param {Array} messages - Chat history [{role, content}]
 * @returns {string} AI response
 */
const chatWithTutor = async (messages) => {
  try {
    if (!isGeminiEnabled()) {
      return 'AI Tutor is currently unavailable. Please configure the GEMINI_API_KEY.';
    }

    const systemInstruction = `You are an intelligent AI tutor on the Smart Education Platform. 
Your role is to help students learn effectively by:
- Explaining concepts clearly and step-by-step
- Providing examples and analogies
- Asking follow-up questions to check understanding
- Adapting your teaching style to the student's level
Be encouraging, patient, and thorough in your explanations.`;

    // Convert messages to Gemini format: role must be "user" or "model"
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    return await callGemini(systemInstruction, contents);
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
    if (!isGeminiEnabled()) {
      return 'Resource recommendations are currently unavailable. Please configure the GEMINI_API_KEY.';
    }

    const systemInstruction =
      'You are an educational resource recommender. Provide structured learning resource recommendations including books, online courses, videos, and practice exercises.';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Recommend learning resources for "${topic}" at the ${level} level. Include a mix of free and paid resources. Format as a structured list.`,
          },
        ],
      },
    ];

    return await callGemini(systemInstruction, contents, { temperature: 0.5, maxOutputTokens: 800 });
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
    if (!isGeminiEnabled()) {
      return 'Resume analysis is currently unavailable. Please configure the GEMINI_API_KEY.';
    }

    const systemInstruction =
      'You are an expert resume analyzer and career advisor. Analyze resumes and provide constructive feedback including strengths, weaknesses, suggestions for improvement, and ATS optimization tips.';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Please analyze this resume and provide detailed feedback:\n\n${resumeText}`,
          },
        ],
      },
    ];

    return await callGemini(systemInstruction, contents, { temperature: 0.5 });
  } catch (error) {
    console.error('Resume Analysis Error:', error.message);
    return 'Unable to analyze resume at this time. Please try again later.';
  }
};

module.exports = { chatWithTutor, getRecommendations, analyzeResume };

