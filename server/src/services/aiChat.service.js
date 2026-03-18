const isGeminiEnabled = () => Boolean(process.env.GEMINI_API_KEY);

/**
 * Call the Gemini API.
 * Embeds system instruction as a [SYSTEM] prefix in the first user turn
 * for compatibility with models that don't support the systemInstruction field.
 */
const callGemini = async (systemInstruction, contents, generationConfig = {}, modelOverride = null) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = modelOverride || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  // Prepend system instruction into the first user message (universal compatibility)
  let finalContents = [...contents];
  if (systemInstruction && finalContents.length > 0) {
    const firstUserIdx = finalContents.findIndex(c => c.role === 'user');
    if (firstUserIdx >= 0) {
      finalContents = [...finalContents];
      const firstMsg = finalContents[firstUserIdx];
      finalContents[firstUserIdx] = {
        ...firstMsg,
        parts: [{ text: `[System: ${systemInstruction}]\n\n${firstMsg.parts[0].text}` }],
      };
    }
  }

  const body = {
    contents: finalContents,
    generationConfig: {
      temperature: generationConfig.temperature ?? 0.75,
      maxOutputTokens: generationConfig.maxOutputTokens ?? 600,
    },
  };

  console.log(`[Gemini] → ${model} | ${finalContents.length} turns`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    const errMsg = data.error?.message || JSON.stringify(data);
    console.error(`[Gemini] ✗ ${response.status}: ${errMsg.slice(0, 200)}`);
    throw new Error(errMsg);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log(`[Gemini] ✓ ${text.slice(0, 100).replace(/\n/g, ' ')}...`);
  return text;
};

/* ── Offline math helpers (when Gemini is unavailable) ── */

const computeSimpleMath = (input) => {
  const safe = input.trim().replace(/\s+/g, '');
  if (!/^[0-9+\-*/().]+$/.test(safe)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${safe})`)();
    return typeof result === 'number' && Number.isFinite(result) ? result : null;
  } catch { return null; }
};

const solveQuadraticFromString = (input) => {
  const n = input.toLowerCase().replace(/\s+/g, '');
  if (!/x\^2/.test(n)) return null;

  const parseCoef = (s) => {
    if (!s) return 0;
    const clean = s.replace(/x\^2|x/, '');
    if (clean === '' || clean === '+') return 1;
    if (clean === '-') return -1;
    const v = Number(clean);
    return Number.isFinite(v) ? v : 0;
  };

  const a = parseCoef(n.match(/([+\-]?\d*)x\^2/)?.[1]);
  const b = parseCoef(n.match(/([+\-]?\d*)x(?!\^)/)?.[1]);
  const cMatch = n
    .replace(/([+\-]?\d*)x\^2/g, '')
    .replace(/([+\-]?\d*)x(?!\^)/g, '')
    .match(/([+\-]?\d+)(?![\^0-9])/g);
  const c = cMatch ? Number(cMatch[cMatch.length - 1]) : 0;

  if (a === 0) return null;
  const disc = b * b - 4 * a * c;
  if (disc < 0) {
    return `No real roots (complex: ${(-b / (2 * a)).toFixed(2)} ± ${(Math.sqrt(-disc) / (2 * a)).toFixed(2)}i)`;
  }
  const sq = Math.sqrt(disc);
  const x1 = ((-b + sq) / (2 * a)).toFixed(2);
  const x2 = ((-b - sq) / (2 * a)).toFixed(2);
  return x1 === x2 ? `One real root: x = ${x1}` : `Roots: x = ${x1} and x = ${x2}`;
};

const getFallbackResponse = (msg) => {
  const n = msg.trim().toLowerCase();
  const quad = solveQuadraticFromString(msg);
  if (quad) return quad;
  const math = computeSimpleMath(msg);
  if (math !== null) return `The answer is ${math}.`;
  if (['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(g => n.startsWith(g)))
    return "Hello! I'm here to help — what topic are you curious about today?";
  if (n.includes('thank')) return "You're welcome! Feel free to ask anything.";
  if (n.includes('help')) return "Sure! Ask me about any academic topic, programming concept, or study strategy.";
  return "Great question! Could you share a bit more detail so I can give you the best answer?";
};

/**
 * Generate a response from the AI model.
 * @param {string} userMessage - The latest user message.
 * @param {Array<{role, message}>} history - Previous messages (oldest first).
 */
const generateChatResponse = async (userMessage, history = []) => {
  if (!isGeminiEnabled()) {
    console.warn('[Gemini] API key not configured — offline fallback.');
    return getFallbackResponse(userMessage);
  }

  const systemInstruction =
    'You are Priya, a warm and knowledgeable AI study guide on the EduSuccess platform. ' +
    'Help students understand academic concepts clearly and concisely. ' +
    'Keep responses to 2-4 sentences, be encouraging and supportive. ' +
    'If asked about mental health or stress, respond empathetically.';

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.message }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  // Try primary model, then lite fallback
  const modelsToTry = [...new Set([
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.5-flash-lite-001',
  ])];

  for (const model of modelsToTry) {
    try {
      const reply = await callGemini(systemInstruction, contents, { temperature: 0.75, maxOutputTokens: 512 }, model);
      if (reply && reply.trim()) return reply.trim();
    } catch (err) {
      console.error(`[Gemini] Model "${model}" failed: ${err.message.slice(0, 120)}`);
    }
  }

  console.error('[Gemini] All models failed — offline fallback.');
  return getFallbackResponse(userMessage);
};

module.exports = { generateChatResponse };
