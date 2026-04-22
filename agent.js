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
 */
async function processQuery(query, assetContext = '') {
  try {
    const state = {
      query,
      assetContext,
      intent: null,
      steps: [],
      result: null,
      fromLLM: false
    };

    // Step 1: Analyze intent
    state.intent = analyzeIntent(query);
    state.steps.push(`Intent detected: ${state.intent.type}`);

    // Step 2: Execute appropriate tool
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
        toolResult = handleGeneralKnowledge(query);
        state.steps.push('Used reasoning module');
        break;

      default:
        toolResult = null;
    }

    // Step 3: Use tool result or fall back to LLM
    if (toolResult && toolResult.success) {
      state.result = toolResult.answer;
      state.fromLLM = false;
      state.steps.push('Tool succeeded');
    } else {
      state.steps.push('Tool failed, using LLM fallback');
      state.result = await callLLM(query, assetContext);
      state.fromLLM = true;
    }

    // Step 4: Format output — pass fromLLM flag so formatter knows whether to clean
    const formattedOutput = formatOutput(
      state.result,
      state.intent.type,
      state.intent.metadata,
      state.fromLLM
    );

    return formattedOutput;

  } catch (error) {
    console.error('Agent error:', error);
    return 'Unable to answer.';
  }
}

/**
 * Reasoning module for simple general knowledge
 */
function handleGeneralKnowledge(query) {
  const lowerQuery = query.toLowerCase();

  // Yes/No questions - common facts
  if (lowerQuery.includes('sky') && (lowerQuery.includes('blue') || lowerQuery.includes('color') || lowerQuery.includes('colour'))) {
    return { success: true, answer: 'Yes.' };
  }
  if (lowerQuery.includes('water') && lowerQuery.includes('wet')) {
    return { success: true, answer: 'Yes.' };
  }
  if (lowerQuery.includes('sun') && lowerQuery.includes('hot')) {
    return { success: true, answer: 'Yes.' };
  }

  // Capital questions
  if (lowerQuery.includes('capital of') || lowerQuery.includes('capital city')) {
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
      'england': 'London',
      'canada': 'Ottawa',
      'australia': 'Canberra',
      'brazil': 'Brasília',
      'russia': 'Moscow',
      'mexico': 'Mexico City',
      'argentina': 'Buenos Aires',
      'south africa': 'Pretoria',
      'egypt': 'Cairo',
      'nigeria': 'Abuja',
      'kenya': 'Nairobi',
      'thailand': 'Bangkok',
      'indonesia': 'Jakarta',
      'pakistan': 'Islamabad',
      'bangladesh': 'Dhaka',
      'south korea': 'Seoul',
      'north korea': 'Pyongyang',
      'vietnam': 'Hanoi',
      'philippines': 'Manila',
      'malaysia': 'Kuala Lumpur',
      'singapore': 'Singapore',
      'new zealand': 'Wellington',
      'turkey': 'Ankara',
      'iran': 'Tehran',
      'iraq': 'Baghdad',
      'saudi arabia': 'Riyadh',
      'ukraine': 'Kyiv',
      'poland': 'Warsaw',
      'sweden': 'Stockholm',
      'norway': 'Oslo',
      'denmark': 'Copenhagen',
      'finland': 'Helsinki',
      'netherlands': 'Amsterdam',
      'belgium': 'Brussels',
      'switzerland': 'Bern',
      'austria': 'Vienna',
      'portugal': 'Lisbon',
      'greece': 'Athens',
      'romania': 'Bucharest',
      'czech republic': 'Prague',
      'hungary': 'Budapest'
    };

    for (const [country, capital] of Object.entries(capitals)) {
      if (lowerQuery.includes(country)) {
        return { success: true, answer: capital };
      }
    }
  }

  // Color questions
  if (lowerQuery.includes('color') || lowerQuery.includes('colour')) {
    if (lowerQuery.includes('sky')) return { success: true, answer: 'Blue.' };
    if (lowerQuery.includes('grass')) return { success: true, answer: 'Green.' };
    if (lowerQuery.includes('sun')) return { success: true, answer: 'Yellow.' };
    if (lowerQuery.includes('blood')) return { success: true, answer: 'Red.' };
    if (lowerQuery.includes('snow')) return { success: true, answer: 'White.' };
    if (lowerQuery.includes('coal') || lowerQuery.includes('night')) return { success: true, answer: 'Black.' };
    if (lowerQuery.includes('ocean') || lowerQuery.includes('sea')) return { success: true, answer: 'Blue.' };
  }

  return { success: false };
}

module.exports = { processQuery };