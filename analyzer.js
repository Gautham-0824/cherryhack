/**
 * Analyzer Module - Intent Detection
 * Determines what type of query this is and extracts metadata
 */

function analyzeIntent(query) {
  const lowerQuery = query.toLowerCase();

  if (isMathQuery(lowerQuery)) {
    return {
      type: 'math',
      metadata: extractMathMetadata(query)
    };
  }

  if (isStringQuery(lowerQuery)) {
    return {
      type: 'string',
      metadata: extractStringMetadata(query)
    };
  }

  if (isLogicQuery(lowerQuery)) {
    return {
      type: 'logic',
      metadata: extractLogicMetadata(query)
    };
  }

  return {
    type: 'general',
    metadata: {}
  };
}

function isMathQuery(query) {
  const mathKeywords = [
    'add', 'sum', 'plus', 'addition',
    'subtract', 'minus', 'difference',
    'multiply', 'times', 'product', 'multiplied',
    'divide', 'divided', 'division',
    'floor division', 'integer division',
    'modulo', 'remainder', 'mod',
    'power', 'exponent', 'raised', 'to the power',
    'calculate', 'compute', 'what is', 'whats'
  ];

  const hasNumbers = /\d+/.test(query);
  const hasMathSymbols = /[\+\-\*\/\×\÷\%\^]/.test(query) || /\/\//.test(query) || /\d\s*[xX×]\s*\d/.test(query);
  const hasMathKeywords = mathKeywords.some(keyword => query.includes(keyword));

  return (hasNumbers && hasMathSymbols) || (hasNumbers && hasMathKeywords);
}

function extractMathMetadata(query) {
  const metadata = {
    operation: null,
    numbers: []
  };

  // Extract all numbers (including decimals)
  const numberMatches = query.match(/\d+(\.\d+)?/g);
  if (numberMatches) {
    metadata.numbers = numberMatches.map(n => parseFloat(n));
  }

  const lowerQuery = query.toLowerCase();

  // Keyword-based detection first (more reliable)
  if (lowerQuery.includes('add') || lowerQuery.includes('sum') || lowerQuery.includes('plus') || lowerQuery.includes('addition')) {
    metadata.operation = 'add';
  } else if (lowerQuery.includes('subtract') || lowerQuery.includes('minus') || lowerQuery.includes('difference')) {
    metadata.operation = 'subtract';
  } else if (lowerQuery.includes('multiply') || lowerQuery.includes('multiplied') || lowerQuery.includes('times') || lowerQuery.includes('product')) {
    metadata.operation = 'multiply';
  } else if (lowerQuery.includes('floor division') || lowerQuery.includes('integer division')) {
    metadata.operation = 'floor_divide';
  } else if (lowerQuery.includes('divide') || lowerQuery.includes('divided') || lowerQuery.includes('division')) {
    metadata.operation = 'divide';
  } else if (lowerQuery.includes('modulo') || lowerQuery.includes('remainder') || lowerQuery.includes(' mod ')) {
    metadata.operation = 'modulo';
  } else if (lowerQuery.includes('power') || lowerQuery.includes('exponent') || lowerQuery.includes('raised') || lowerQuery.includes('to the power')) {
    metadata.operation = 'exponent';
  }
  // Symbol-based detection (check // before / to avoid false match)
  else if (query.includes('//')) {
    metadata.operation = 'floor_divide';
  } else if (query.includes('+')) {
    metadata.operation = 'add';
  } else if (/\d\s*-\s*\d/.test(query)) {
    // Only treat '-' as subtraction if it's between two numbers
    metadata.operation = 'subtract';
  } else if (query.includes('*') || query.includes('×') || /\d\s*[xX]\s*\d/.test(query)) {
    metadata.operation = 'multiply';
  } else if (query.includes('/') || query.includes('÷')) {
    metadata.operation = 'divide';
  } else if (query.includes('%')) {
    metadata.operation = 'modulo';
  } else if (query.includes('^') || query.includes('**')) {
    metadata.operation = 'exponent';
  }

  return metadata;
}

function isStringQuery(query) {
  const stringKeywords = [
    'reverse', 'length', 'uppercase', 'lowercase',
    'capitalize', 'count characters', 'how many characters', 'how long'
  ];
  return stringKeywords.some(keyword => query.includes(keyword));
}

function extractStringMetadata(query) {
  const metadata = {
    operation: null,
    target: null
  };

  const lowerQuery = query.toLowerCase();

  function extractTarget(q) {
    // 1. Quoted string
    const quoteMatch = q.match(/["']([^"']+)["']/);
    if (quoteMatch) return quoteMatch[1];

    // 2. "the word X" or "the string X" pattern
    const labelMatch = q.match(/(?:the\s+)?(?:word|string|text|phrase)\s+["']?(\w+)["']?/i);
    if (labelMatch) return labelMatch[1];

    // 3. Last meaningful word (walk from end, skip stop words)
    const words = q.trim().replace(/[?!.]$/, '').split(/\s+/);
    const stopWords = new Set([
      'reverse','length','uppercase','lowercase','capitalize',
      'convert','what','is','the','of','find','get','give','me',
      'string','word','text','to','in','a','an','please','how',
      'many','characters','long','upper','lower','case','for'
    ]);
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

function isLogicQuery(query) {
  const logicKeywords = [
    'even', 'odd', 'greater', 'less than', 'less', 'equal',
    'compare', 'larger', 'smaller', 'bigger', 'prime'
  ];
  return logicKeywords.some(keyword => query.includes(keyword));
}

function extractLogicMetadata(query) {
  const metadata = {
    operation: null,
    values: []
  };

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('even')) {
    metadata.operation = 'even';
    const m = query.match(/\d+/);
    if (m) metadata.values = [parseInt(m[0])];
  } else if (lowerQuery.includes('odd')) {
    metadata.operation = 'odd';
    const m = query.match(/\d+/);
    if (m) metadata.values = [parseInt(m[0])];
  } else if (lowerQuery.includes('prime')) {
    metadata.operation = 'prime';
    const m = query.match(/\d+/);
    if (m) metadata.values = [parseInt(m[0])];
  } else if (lowerQuery.includes('greater') || lowerQuery.includes('larger') || lowerQuery.includes('bigger')) {
    metadata.operation = 'greater';
    const nums = query.match(/\d+/g);
    if (nums) metadata.values = nums.map(n => parseInt(n));
  } else if (lowerQuery.includes('less') || lowerQuery.includes('smaller')) {
    metadata.operation = 'less';
    const nums = query.match(/\d+/g);
    if (nums) metadata.values = nums.map(n => parseInt(n));
  } else if (lowerQuery.includes('equal')) {
    metadata.operation = 'equal';
    const nums = query.match(/\d+/g);
    if (nums) metadata.values = nums.map(n => parseInt(n));
  }

  return metadata;
}

module.exports = { analyzeIntent };