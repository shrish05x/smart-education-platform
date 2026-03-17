const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client (uses existing GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

/**
 * Generate an AI answer suggestion for a question post.
 */
const suggestAnswer = async (title, description) => {
  const model = getModel();
  const prompt = `You are an expert CS tutor and student mentor. A student asked the following question:

Title: ${title}
Description: ${description}

Provide a clear, structured, and helpful answer. Use bullet points and examples where appropriate. Keep it educational and concise (max 400 words).`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * Summarize an entire discussion thread into bullet points.
 */
const summarizeThread = async (post, comments) => {
  const model = getModel();
  const commentText = comments
    .filter((c) => !c.parentId)
    .slice(0, 10)
    .map((c, i) => `Answer ${i + 1}: ${c.content}`)
    .join('\n\n');

  const prompt = `Summarize this Q&A discussion thread in 3–5 clear bullet points, highlighting key insights and solutions.

Question: ${post.title}
${post.description}

${commentText}

Return only the bullet point summary, no extra text.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * Auto-detect relevant CS/academic tags from a post's title and description.
 */
const autoTag = async (title, description) => {
  const model = getModel();
  const allowed = ['dsa', 'java', 'python', 'ai', 'ml', 'dbms', 'os', 'cn', 'web-dev', 'math', 'system-design', 'interview-prep', 'c++', 'react', 'node', 'sql'];

  const prompt = `Detect the CS or academic topics from the following text and return ONLY a JSON array of max 5 lowercase tags from this allowed list: ${JSON.stringify(allowed)}.

Title: ${title}
Description: ${description}

Return ONLY valid JSON like: ["tag1","tag2"]`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  // Extract JSON array from the output
  const match = raw.match(/\[.*?\]/s);
  if (!match) return [];
  const tags = JSON.parse(match[0]);
  return tags.filter((t) => allowed.includes(t)).slice(0, 5);
};

/**
 * Find similar questions from a list of existing post titles.
 */
const findSimilarPosts = async (title, existingPosts) => {
  if (!existingPosts || existingPosts.length === 0) return [];
  const model = getModel();
  const postList = existingPosts.map((p, i) => `${i + 1}. [${p._id}] ${p.title}`).join('\n');

  const prompt = `Given this new question: "${title}"

Which of these existing questions are most similar or duplicate? Return a JSON array of the matching ones (max 5) with their IDs and titles.

${postList}

Return ONLY valid JSON like: [{"id":"...","title":"..."}]`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const match = raw.match(/\[.*?\]/s);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
};

module.exports = { suggestAnswer, summarizeThread, autoTag, findSimilarPosts };
