/**
 * String Tool - Deterministic String Manipulation
 * Handles string operations without AI calls
 */

/**
 * Execute string operation
 */
function execute(query, metadata) {
  try {
    const { operation, target } = metadata;

    if (!target) {
      return { success: false, error: 'No target string found' };
    }

    let result;

    switch (operation) {
      case 'reverse':
        result = reverseString(target);
        break;

      case 'length':
        result = target.length;
        break;

      case 'uppercase':
        result = target.toUpperCase();
        break;

      case 'lowercase':
        result = target.toLowerCase();
        break;

      case 'capitalize':
        result = capitalize(target);
        break;

      default:
        return { success: false, error: 'Unknown string operation' };
    }

    return {
      success: true,
      answer: result
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Reverse a string
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Count characters (excluding spaces)
 */
function countCharacters(str) {
  return str.replace(/\s/g, '').length;
}

/**
 * Count words
 */
function countWords(str) {
  return str.trim().split(/\s+/).length;
}

module.exports = { execute };
