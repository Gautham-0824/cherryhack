/**
 * Formatter Module - Strict Output Formatting
 * Ensures consistent, clean output format
 */

/**
 * Format output based on intent type
 * @param {*} result - Raw result from tool or LLM
 * @param {string} intentType - 'math'|'string'|'logic'|'general'
 * @param {object} metadata - Intent metadata
 * @param {boolean} fromLLM - Whether result came from LLM (needs cleaning)
 */
function formatOutput(result, intentType, metadata = {}, fromLLM = false) {
  if (result === null || result === undefined || result === '') {
    return 'Unable to answer.';
  }

  let output = String(result).trim();

  // Only clean LLM output — tool outputs are already clean values
  if (fromLLM) {
    output = cleanLLMOutput(output);
  }

  switch (intentType) {
    case 'math':
      return formatMathOutput(output, metadata.operation);
    case 'string':
      return formatStringOutput(output, metadata.operation);
    case 'logic':
      return formatLogicOutput(output);
    case 'general':
      return formatGeneralOutput(output);
    default:
      return ensurePeriod(output);
  }
}

function cleanLLMOutput(text) {
  // Strip verbose prefixes from LLM responses only
  text = text.replace(/^(the answer is|the result is|the sum is|the difference is|the product is|the quotient is|the length is|it is|this is|answer:|result:)\s*/i, '');
  text = text.replace(/\.{2,}$/, '.');
  return text.trim();
}

function ensurePeriod(text) {
  if (!text.match(/[.!?]$/)) return text + '.';
  return text;
}

const MATH_LABELS = {
  add:      'sum',
  subtract: 'difference',
  multiply: 'product',
  divide:   'quotient'
};

function formatMathOutput(output, operation) {
  const label = MATH_LABELS[operation] || 'result';
  const stripped = output.replace(/\.$/, '').trim();

  // Pure number
  if (/^-?\d+(\.\d+)?$/.test(stripped)) {
    const num = parseFloat(stripped);
    return `The ${label} is ${num}.`;
  }

  // Already a complete sentence
  if (/^The \w+ is .+\.$/.test(output)) return output;

  return `The ${label} is ${stripped}.`;
}

function formatStringOutput(output, operation) {
  const stripped = output.replace(/\.$/, '').trim();

  if (operation === 'length' && /^\d+$/.test(stripped)) {
    return `The length is ${stripped}.`;
  }
  if (/^The .+ is .+\.$/.test(output)) return output;
  if (operation === 'reverse') return `The reverse is ${stripped}.`;
  if (operation === 'uppercase') return `The uppercase is ${stripped}.`;
  if (operation === 'lowercase') return `The lowercase is ${stripped}.`;
  if (operation === 'capitalize') return `The capitalized form is ${stripped}.`;

  return `The result is ${stripped}.`;
}

function formatLogicOutput(output) {
  const lower = output.toLowerCase().replace(/\.$/, '').trim();
  if (lower === 'yes' || lower === 'true') return 'Yes.';
  if (lower === 'no' || lower === 'false') return 'No.';
  if (output === 'Yes.' || output === 'No.') return output;
  return ensurePeriod(output);
}

function formatGeneralOutput(output) {
  const lower = output.toLowerCase().replace(/\.$/, '').trim();
  if (lower === 'yes') return 'Yes.';
  if (lower === 'no') return 'No.';
  return ensurePeriod(output);
}

module.exports = { formatOutput };