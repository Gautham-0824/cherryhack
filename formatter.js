/**
 * Formatter Module - Strict Output Formatting
 * Ensures consistent, clean output format
 */

/**
 * Format output based on intent type
 * Enforces strict formatting rules
 */
function formatOutput(result, intentType, metadata = {}) {
  if (!result) {
    return 'Unable to answer.';
  }

  // Convert to string and trim
  let output = String(result).trim();

  // Remove any explanatory prefixes/suffixes
  output = cleanOutput(output);

  // Apply intent-specific formatting
  switch (intentType) {
    case 'math':
      return formatMathOutput(output, metadata.operation);
    
    case 'string':
      return formatStringOutput(output);
    
    case 'logic':
      return formatLogicOutput(output);
    
    case 'general':
      return formatGeneralOutput(output);
    
    default:
      return output;
  }
}

/**
 * Clean output by removing common unwanted patterns
 */
function cleanOutput(text) {
  // Remove common prefixes so the formatter can apply the correct label
  text = text.replace(/^(the answer is|the result is|the sum is|the difference is|the product is|the quotient is|it is|this is|answer:|result:)\s*/i, '');
  
  // Remove trailing punctuation if it's excessive
  text = text.replace(/\.{2,}$/, '.');
  
  // Ensure single trailing period for statements
  if (!text.match(/[.!?]$/)) {
    text += '.';
  }

  return text;
}

/**
 * Map math operation to its result label
 */
const MATH_LABELS = {
  add:      'sum',
  subtract: 'difference',
  multiply: 'product',
  divide:   'quotient'
};

/**
 * Format math results using operation-specific labels
 * e.g. "The sum is 45."  "The product is 56."
 */
function formatMathOutput(output, operation) {
  // Resolve label: use operation-specific word, fall back to generic "result"
  const label = MATH_LABELS[operation] || 'result';

  // Check if it's a pure number
  const numMatch = output.match(/^-?\d+(\.\d+)?\.?$/);
  if (numMatch) {
    const num = parseFloat(output);
    return `The ${label} is ${num}.`;
  }

  // If already formatted with a label, return as-is
  if (output.startsWith('The')) {
    return output;
  }

  return `The ${label} is ${output}.`;
}

/**
 * Format string manipulation results
 */
function formatStringOutput(output) {
  // If it's a length query
  if (/^\d+\.?$/.test(output)) {
    return `The length is ${parseInt(output)}.`;
  }

  // If it's a reversed string or transformed string
  if (!output.startsWith('The')) {
    return `The result is ${output}.`;
  }

  return output;
}

/**
 * Format logic results
 */
function formatLogicOutput(output) {
  const lower = output.toLowerCase();

  // Normalize yes/no answers
  if (lower.includes('yes') || lower === 'true') {
    return 'Yes.';
  }
  if (lower.includes('no') || lower === 'false') {
    return 'No.';
  }

  // If already properly formatted
  if (output.match(/^(Yes|No)\.$/)) {
    return output;
  }

  return output;
}

/**
 * Format general knowledge results
 */
function formatGeneralOutput(output) {
  // If it's a simple yes/no
  const lower = output.toLowerCase();
  if (lower === 'yes' || lower === 'yes.') {
    return 'Yes.';
  }
  if (lower === 'no' || lower === 'no.') {
    return 'No.';
  }

  // If it's a single word answer (like a capital city)
  if (output.split(' ').length === 1 && !output.endsWith('.')) {
    return `${output}.`;
  }

  // Ensure proper sentence ending
  if (!output.match(/[.!?]$/)) {
    return `${output}.`;
  }

  return output;
}

module.exports = { formatOutput };
