/**
 * LLM Fallback Module
 * Only used when deterministic tools fail
 * Uses low temperature for consistent outputs
 */

const axios = require('axios');

/**
 * Call LLM as fallback
 * Only used when deterministic tools fail
 * @param {string} query - The user query
 * @param {string} assetContext - Text fetched from asset URLs (may be empty)
 */
async function callLLM(query, assetContext = '') {
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.log('No LLM API key found, using fallback response');
      return generateFallbackResponse(query);
    }

    // Build the full prompt — prepend asset context if present
    const fullQuery = assetContext
      ? `Context:\n${assetContext}\n\nQuestion: ${query}`
      : query;

    // Determine which API to use
    if (process.env.OPENAI_API_KEY) {
      return await callOpenAI(fullQuery);
    } else if (process.env.ANTHROPIC_API_KEY) {
      return await callAnthropic(fullQuery);
    }

    return generateFallbackResponse(query);

  } catch (error) {
    console.error('LLM call failed:', error.message);
    return generateFallbackResponse(query);
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(query) {
  const systemPrompt = `You are a precise answer bot. Strict rules:
1. Provide ONLY the direct answer — no explanations, no extra text
2. Keep responses under 15 words
3. For yes/no questions answer only: Yes. or No.
4. For math: "The sum is X." / "The difference is X." / "The product is X." / "The quotient is X."
5. For factual/general questions state the fact directly as a short sentence ending with a period
6. If context is provided, use it to answer the question
7. Never say "I don't know" — give your best short answer`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.1,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(query) {
  const systemPrompt = `You are a precise answer bot. Strict rules:
1. Provide ONLY the direct answer — no explanations, no extra text
2. Keep responses under 15 words
3. For yes/no questions answer only: Yes. or No.
4. For math: "The sum is X." / "The difference is X." / "The product is X." / "The quotient is X."
5. For factual/general questions state the fact directly as a short sentence ending with a period
6. If context is provided, use it to answer the question
7. Never say "I don't know" — give your best short answer`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        temperature: 0.1,
        messages: [
          { role: 'user', content: query }
        ],
        system: systemPrompt
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    return response.data.content[0].text.trim();
  } catch (error) {
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

/**
 * Generate fallback response when LLM is unavailable
 */
function generateFallbackResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Simple pattern matching for common questions
  if (lowerQuery.includes('what') || lowerQuery.includes('who') || lowerQuery.includes('where')) {
    return 'Unable to answer.';
  }

  if (lowerQuery.includes('is') || lowerQuery.includes('are') || lowerQuery.includes('does')) {
    // Default to "No." for unknown yes/no questions
    return 'Unable to answer.';
  }

  return 'Unable to answer.';
}

module.exports = { callLLM };
