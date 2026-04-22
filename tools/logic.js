/**
 * Logic Tool - Deterministic Logic Operations
 */

function execute(query, metadata) {
  try {
    const { operation, values } = metadata;

    if (!values || values.length === 0) {
      return { success: false, error: 'No values found' };
    }

    let result;

    switch (operation) {
      case 'even':
        result = values[0] % 2 === 0 ? 'Yes.' : 'No.';
        break;

      case 'odd':
        result = values[0] % 2 !== 0 ? 'Yes.' : 'No.';
        break;

      case 'prime':
        result = isPrime(values[0]) ? 'Yes.' : 'No.';
        break;

      case 'greater':
        if (values.length < 2) return { success: false, error: 'Need at least 2 values' };
        result = values[0] > values[1] ? 'Yes.' : 'No.';
        break;

      case 'less':
        if (values.length < 2) return { success: false, error: 'Need at least 2 values' };
        result = values[0] < values[1] ? 'Yes.' : 'No.';
        break;

      case 'equal':
        if (values.length < 2) return { success: false, error: 'Need at least 2 values' };
        result = values[0] === values[1] ? 'Yes.' : 'No.';
        break;

      default:
        return { success: false, error: 'Unknown logic operation' };
    }

    return { success: true, answer: result };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

module.exports = { execute };