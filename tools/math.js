/**
 * Math Tool - Deterministic Mathematical Operations
 * Handles arithmetic without AI calls
 */

/**
 * Execute math operation
 */
function execute(query, metadata) {
  try {
    const { operation, numbers } = metadata;

    // Validate we have enough numbers
    if (!numbers || numbers.length === 0) {
      return { success: false, error: 'No numbers found' };
    }

    let result;

    switch (operation) {
      case 'add':
        result = numbers.reduce((sum, num) => sum + num, 0);
        break;

      case 'subtract':
        if (numbers.length < 2) {
          return { success: false, error: 'Need at least 2 numbers' };
        }
        result = numbers[0] - numbers[1];
        break;

      case 'multiply':
        result = numbers.reduce((product, num) => product * num, 1);
        break;

      case 'divide':
        if (numbers.length < 2) {
          return { success: false, error: 'Need at least 2 numbers' };
        }
        if (numbers[1] === 0) {
          return { success: false, error: 'Division by zero' };
        }
        result = numbers[0] / numbers[1];
        break;

      case 'modulo':
        if (numbers.length < 2) {
          return { success: false, error: 'Need at least 2 numbers' };
        }
        if (numbers[1] === 0) {
          return { success: false, error: 'Modulo by zero' };
        }
        result = numbers[0] % numbers[1];
        break;

      case 'exponent':
        if (numbers.length < 2) {
          return { success: false, error: 'Need at least 2 numbers' };
        }
        result = Math.pow(numbers[0], numbers[1]);
        break;

      default:
        // Try to evaluate as expression
        result = evaluateExpression(query);
        if (result === null) {
          return { success: false, error: 'Unknown operation' };
        }
    }

    // Round to reasonable precision
    if (typeof result === 'number' && !Number.isInteger(result)) {
      result = Math.round(result * 100) / 100;
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
 * Evaluate mathematical expression safely
 * Uses regex parsing instead of eval()
 * Supports: +  -  *  /  x  ×  ÷
 */
function evaluateExpression(expr) {
  try {
    // Normalise: replace 'x' between digits and '×' / '÷' with standard symbols
    expr = expr.replace(/(\d)\s*[xX×]\s*(\d)/g, '$1*$2');
    expr = expr.replace(/÷/g, '/');

    // Remove remaining whitespace
    expr = expr.replace(/\s+/g, '');

    // Pattern: number operator number
    const simplePattern = /(\d+\.?\d*)([\+\-\*\/])(\d+\.?\d*)/;
    const match = expr.match(simplePattern);

    if (match) {
      const num1 = parseFloat(match[1]);
      const operator = match[2];
      const num2 = parseFloat(match[3]);

      switch (operator) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num2 !== 0 ? num1 / num2 : null;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Additional helper: Parse word-based math
 */
function parseWordMath(query) {
  const lowerQuery = query.toLowerCase();
  
  // Pattern: "what is X plus Y"
  const patterns = [
    /what\s+is\s+(\d+)\s+plus\s+(\d+)/,
    /what\s+is\s+(\d+)\s+minus\s+(\d+)/,
    /what\s+is\s+(\d+)\s+times\s+(\d+)/,
    /what\s+is\s+(\d+)\s+divided\s+by\s+(\d+)/
  ];

  for (const pattern of patterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      return {
        num1: parseInt(match[1]),
        num2: parseInt(match[2]),
        operation: pattern.source.includes('plus') ? 'add' :
                   pattern.source.includes('minus') ? 'subtract' :
                   pattern.source.includes('times') ? 'multiply' : 'divide'
      };
    }
  }

  return null;
}

module.exports = { execute };
