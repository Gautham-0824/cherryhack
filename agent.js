/**
 * Agent Controller - Main Agent Loop
 * Orchestrates the decision-making process
 */

const { analyzeIntent } = require('./analyzer');
const { formatOutput } = require('./formatter');
const { callLLM } = require('./llm');
const mathTool = require('./tools/math');
const stringTool = require('./tools/string');
const logicTool = require('./tools/logic');

/**
 * Main agent processing function
 * Implements the agent loop: analyze -> decide -> execute -> format
 */
async function processQuery(query) {
  try {
    // Agent state
    const state = {
      query: query,
      intent: null,
      steps: [],
      result: null
    };

    // Step 1: Analyze query to detect intent
    state.intent = analyzeIntent(query);
    state.steps.push(`Intent detected: ${state.intent.type}`);

    // Step 2: Decide action based on intent
    let toolResult = null;

    switch (state.intent.type) {
      case 'math':
        toolResult = mathTool.execute(query, state.intent.metadata);
        state.steps.push('Used math tool');
        break;

      case 'string':
        toolResult = stringTool.execute(query, state.intent.metadata);
        state.steps.push('Used string tool');
        break;

      case 'logic':
        toolResult = logicTool.execute(query, state.intent.metadata);
        state.steps.push('Used logic tool');
        break;

      case 'general':
        // Use reasoning for simple general knowledge
        toolResult = handleGeneralKnowledge(query);
        state.steps.push('Used reasoning module');
        break;

      default:
        toolResult = null;
    }

    // Step 3: Validate result
    if (toolResult && toolResult.success) {
      state.result = toolResult.answer;
      state.steps.push('Tool succeeded');
    } else {
      // Step 4: LLM fallback
      state.steps.push('Tool failed, using LLM fallback');
      state.result = await callLLM(query);
    }

    // Step 5: Format output strictly
    const formattedOutput = formatOutput(state.result, state.intent.type);

    return formattedOutput;

  } catch (error) {
    console.error('Agent error:', error);
    return 'Unable to answer.';
  }
}

/**
 * Reasoning module for simple general knowledge
 * Handles common patterns without LLM
 */
function handleGeneralKnowledge(query) {
  const lowerQuery = query.toLowerCase();

  // Yes/No questions
  if (lowerQuery.includes('is') || lowerQuery.includes('are') || lowerQuery.includes('does')) {
    // Simple heuristics for common questions
    if (lowerQuery.includes('sky blue')) {
      return { success: true, answer: 'Yes.' };
    }
    if (lowerQuery.includes('water wet')) {
      return { success: true, answer: 'Yes.' };
    }
    if (lowerQuery.includes('sun hot')) {
      return { success: true, answer: 'Yes.' };
    }
  }

  // Capital questions
  if (lowerQuery.includes('capital of')) {
    const capitals = {
      'france': 'Paris',
      'germany': 'Berlin',
      'italy': 'Rome',
      'spain': 'Madrid',
      'japan': 'Tokyo',
      'china': 'Beijing',
      'india': 'New Delhi',
      'usa': 'Washington D.C.',
      'united states': 'Washington D.C.',
      'uk': 'London',
      'united kingdom': 'London',
      'canada': 'Ottawa',
      'australia': 'Canberra',
      'brazil': 'Brasília',
      'russia': 'Moscow'
    };

    for (const [country, capital] of Object.entries(capitals)) {
      if (lowerQuery.includes(country)) {
        return { success: true, answer: capital };
      }
    }
  }

  // Color questions
  if (lowerQuery.includes('color') || lowerQuery.includes('colour')) {
    if (lowerQuery.includes('sky')) {
      return { success: true, answer: 'Blue' };
    }
    if (lowerQuery.includes('grass')) {
      return { success: true, answer: 'Green' };
    }
    if (lowerQuery.includes('sun')) {
      return { success: true, answer: 'Yellow' };
    }
  }

  return { success: false };
}

module.exports = { processQuery };
