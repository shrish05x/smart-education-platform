const isGeminiEnabled = () => {
  return Boolean(process.env.GEMINI_API_KEY);
};

/**
 * Call the Gemini API using the Google AI Generative Language REST endpoint.
 */
const callGemini = async (systemInstruction, contents, generationConfig = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

/**
 * Generate a response from the AI model based on the conversation history.
 *
 * @param {string} userMessage - The latest user message.
 * @param {Array<{role: string, message: string}>} history - Previous messages (oldest first).
 * @returns {Promise<string>} - The AI assistant response.
 */
const computeSimpleMath = (input) => {
  // Allow only numbers, basic operators, and parentheses.
  // This avoids evaluation of arbitrary code.
  const safeMath = input.trim().replace(/\s+/g, '');
  if (!/^[0-9+\-*/().]+$/.test(safeMath)) return null;

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${safeMath})`)();
    if (typeof result === 'number' && Number.isFinite(result)) {
      return result;
    }
  } catch {
    return null;
  }
  return null;
};

const solveQuadraticFromString = (input) => {
  const normalized = input.toLowerCase().replace(/\s+/g, '');
  if (!/x\^2/.test(normalized)) return null;

  const parseCoef = (match) => {
    if (!match) return 0;
    const str = match.replace(/x\^2|x/, '');
    if (str === '' || str === '+') return 1;
    if (str === '-') return -1;
    const num = Number(str);
    return Number.isFinite(num) ? num : 0;
  };

  const aMatch = normalized.match(/([+\-]?\d*)x\^2/);
  const bMatch = normalized.match(/([+\-]?\d*)x(?!\^)/);
  const cMatch = normalized
    .replace(/([+\-]?\d*)x\^2/g, '')
    .replace(/([+\-]?\d*)x(?!\^)/g, '')
    .match(/([+\-]?\d+)(?![\^0-9])/g);

  const a = parseCoef(aMatch ? aMatch[1] : null);
  const b = parseCoef(bMatch ? bMatch[1] : null);
  const c = cMatch ? Number(cMatch[cMatch.length - 1]) : 0;

  if (a === 0) return null;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    const real = (-b / (2 * a)).toFixed(2);
    const imag = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    return `This quadratic has no real roots (complex roots: ${real} ± ${imag}i).`;
  }

  const sqrtD = Math.sqrt(discriminant);
  const x1 = ((-b + sqrtD) / (2 * a)).toFixed(2);
  const x2 = ((-b - sqrtD) / (2 * a)).toFixed(2);
  return x1 === x2
    ? `This quadratic has one real root: x = ${x1}.`
    : `The roots are x = ${x1} and x = ${x2}.`;
};

const getFallbackResponse = (userMessage) => {
  const normalized = userMessage.trim().toLowerCase();

  const quadraticResult = solveQuadraticFromString(userMessage);
  if (quadraticResult) {
    return quadraticResult;
  }

  const mathResult = computeSimpleMath(userMessage);
  if (mathResult !== null) {
    return `It looks like you're asking a math question. The answer is ${mathResult}.`;
  }

  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some((g) => normalized.startsWith(g))) {
    return 'Hello! I\'m here to help — what topic are you curious about today?';
  }

  if (normalized.includes('thank')) {
    return 'You\'re welcome! Feel free to ask another question.';
  }

  if (normalized.includes('help')) {
    return 'Sure! What topic would you like help with? You can ask me about programming concepts, study tips, or anything academic.';
  }

  return 'I\'m currently unable to access the AI service, but I can still help with general guidance. Can you tell me a bit more about what you need?';
};

const generateChatResponse = async (userMessage, history = []) => {
  // Prefer Gemini if configured, otherwise fall back to offline responses.
  if (isGeminiEnabled()) {
    try {
      const systemInstruction =
        'You are an AI academic tutor helping university students understand concepts clearly. Provide explanations, examples, and step-by-step reasoning when appropriate.';

      // Convert history + new message to Gemini contents format
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.message }],
        })),
        { role: 'user', parts: [{ text: userMessage }] },
      ];

      return await callGemini(systemInstruction, contents);
    } catch (error) {
      console.error('AI Chat service error (Gemini):', error.message);
      return getFallbackResponse(userMessage);
    }
  }

  return getFallbackResponse(userMessage);
};

module.exports = { generateChatResponse };
