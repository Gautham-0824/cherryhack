/**
 * LLM Fallback Module
 * Only used when deterministic tools fail
 * Uses low temperature for consistent outputs
 */

const axios = require('axios');

/**
 * Call LLM as fallback
 * This is a placeholder - integrate with your preferred LLM API
 */
async function callLLM(query) {
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.log('No LLM API key found, using fallback response');
      return generateFallbackResponse(query);
    }

    // Determine which API to use
    if (process.env.OPENAI_API_KEY) {
      return await callOpenAI(query);
    } else if (process.env.ANTHROPIC_API_KEY) {
      return await callAnthropic(query);
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
  const systemPrompt = `You are a precise answer bot. Rules:
1. Provide ONLY the direct answer
2. NO explanations or extra text
3. Keep responses under 10 words
4. Use consistent phrasing
5. For yes/no questions, answer only "Yes." or "No."
6. For numerical answers, use format "The answer is X."
7. For factual answers, state the fact directly`;

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
  const systemPrompt = `You are a precise answer bot. Provide ONLY direct answers with NO explanations. Keep responses under 10 words. For yes/no questions, answer only "Yes." or "No."`;

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
