/**
 * Analyzer Module - Intent Detection
 * Determines what type of query this is and extracts metadata
 */

/**
 * Analyze query and detect intent
 * Returns: { type: string, metadata: object }
 */
function analyzeIntent(query) {
  const lowerQuery = query.toLowerCase();

  // Math intent detection
  if (isMathQuery(lowerQuery)) {
    return {
      type: 'math',
      metadata: extractMathMetadata(query)
    };
  }

  // String manipulation intent
  if (isStringQuery(lowerQuery)) {
    return {
      type: 'string',
      metadata: extractStringMetadata(query)
    };
  }

  // Logic intent
  if (isLogicQuery(lowerQuery)) {
    return {
      type: 'logic',
      metadata: extractLogicMetadata(query)
    };
  }

  // General knowledge fallback
  return {
    type: 'general',
    metadata: {}
  };
}

/**
 * Detect if query is math-related
 */
function isMathQuery(query) {
  const mathKeywords = [
    'add', 'sum', 'plus', 'addition',
    'subtract', 'minus', 'difference',
    'multiply', 'times', 'product',
    'divide', 'division',
    'calculate', 'compute', 'what is'
  ];

  const hasNumbers = /\d+/.test(query);
  const hasMathSymbols = /[\+\-\*\/\=]/.test(query);
  const hasMathKeywords = mathKeywords.some(keyword => query.includes(keyword));

  return (hasNumbers && hasMathSymbols) || (hasNumbers && hasMathKeywords);
}

/**
 * Extract math operation details
 */
function extractMathMetadata(query) {
  const metadata = {
    operation: null,
    numbers: []
  };

  // Extract numbers
  const numberMatches = query.match(/\d+(\.\d+)?/g);
  if (numberMatches) {
    metadata.numbers = numberMatches.map(n => parseFloat(n));
  }

  // Detect operation
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('add') || lowerQuery.includes('sum') || lowerQuery.includes('plus')) {
    metadata.operation = 'add';
  } else if (lowerQuery.includes('subtract') || lowerQuery.includes('minus') || lowerQuery.includes('difference')) {
    metadata.operation = 'subtract';
  } else if (lowerQuery.includes('multiply') || lowerQuery.includes('times') || lowerQuery.includes('product')) {
    metadata.operation = 'multiply';
  } else if (lowerQuery.includes('divide') || lowerQuery.includes('division')) {
    metadata.operation = 'divide';
  } else if (query.includes('+')) {
    metadata.operation = 'add';
  } else if (query.includes('-')) {
    metadata.operation = 'subtract';
  } else if (query.includes('*') || query.includes('×')) {
    metadata.operation = 'multiply';
  } else if (query.includes('/') || query.includes('÷')) {
    metadata.operation = 'divide';
  }

  return metadata;
}

/**
 * Detect if query is string manipulation
 */
function isStringQuery(query) {
  const stringKeywords = [
    'reverse', 'length', 'uppercase', 'lowercase',
    'capitalize', 'count', 'characters'
  ];

  return stringKeywords.some(keyword => query.includes(keyword));
}

/**
 * Extract string operation details
 * Handles quoted strings, "the word X", "the string X", or bare last word
 */
function extractStringMetadata(query) {
  const metadata = {
    operation: null,
    target: null
  };

  const lowerQuery = query.toLowerCase();

  // Helper: extract the target string from the query
  // Priority: quoted > "the word/string X" pattern > last meaningful word
  function extractTarget(q) {
    // 1. Quoted string
    const quoteMatch = q.match(/["']([^"']+)["']/);
    if (quoteMatch) return quoteMatch[1];

    // 2. "the word X" or "the string X" pattern
    const labelMatch = q.match(/(?:the\s+)?(?:word|string|text|phrase)\s+["']?(\w+)["']?/i);
    if (labelMatch) return labelMatch[1];

    // 3. Last word in the sentence (most queries end with the target)
    const words = q.trim().replace(/[?!.]$/, '').split(/\s+/);
    const stopWords = new Set(['reverse','length','uppercase','lowercase','capitalize',
      'convert','what','is','the','of','find','get','give','me','string','word','text',
      'to','in','a','an','please','how','many','characters','long','upper','lower','case']);
    // Walk from the end, skip stop words
    for (let i = words.length - 1; i >= 0; i--) {
      if (!stopWords.has(words[i].toLowerCase())) return words[i];
    }
    return null;
  }

  if (lowerQuery.includes('reverse')) {
    metadata.operation = 'reverse';
    metadata.target = extractTarget(query);

  } else if (lowerQuery.includes('length') || lowerQuery.includes('how many characters') || lowerQuery.includes('how long')) {
    metadata.operation = 'length';
    metadata.target = extractTarget(query);

  } else if (lowerQuery.includes('uppercase') || lowerQuery.includes('upper case') || lowerQuery.includes('to upper')) {
    metadata.operation = 'uppercase';
    metadata.target = extractTarget(query);

  } else if (lowerQuery.includes('lowercase') || lowerQuery.includes('lower case') || lowerQuery.includes('to lower')) {
    metadata.operation = 'lowercase';
    metadata.target = extractTarget(query);

  } else if (lowerQuery.includes('capitalize')) {
    metadata.operation = 'capitalize';
    metadata.target = extractTarget(query);
  }

  return metadata;
}

/**
 * Detect if query is logic-related
 */
function isLogicQuery(query) {
  const logicKeywords = [
    'even', 'odd', 'greater', 'less', 'equal',
    'compare', 'larger', 'smaller', 'bigger'
  ];

  return logicKeywords.some(keyword => query.includes(keyword));
}

/**
 * Extract logic operation details
 */
function extractLogicMetadata(query) {
  const metadata = {
    operation: null,
    values: []
  };

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('even') || lowerQuery.includes('odd')) {
    metadata.operation = lowerQuery.includes('even') ? 'even' : 'odd';
    const numberMatch = query.match(/\d+/);
    if (numberMatch) {
      metadata.values = [parseInt(numberMatch[0])];
    }
  } else if (lowerQuery.includes('greater') || lowerQuery.includes('larger') || lowerQuery.includes('bigger')) {
    metadata.operation = 'greater';
    const numbers = query.match(/\d+/g);
    if (numbers) {
      metadata.values = numbers.map(n => parseInt(n));
    }
  } else if (lowerQuery.includes('less') || lowerQuery.includes('smaller')) {
    metadata.operation = 'less';
    const numbers = query.match(/\d+/g);
    if (numbers) {
      metadata.values = numbers.map(n => parseInt(n));
    }
  }

  return metadata;
}

module.exports = { analyzeIntent };
