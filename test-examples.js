/**
 * Test Examples - Sample queries to test the agent
 * Run with: node test-examples.js
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

const testCases = [
  // Math queries
  { query: 'What is 15 plus 30?', expected: 'The answer is 45.' },
  { query: 'Calculate 100 divided by 4', expected: 'The answer is 25.' },
  { query: 'What is 7 times 8?', expected: 'The answer is 56.' },
  { query: '50 - 23', expected: 'The answer is 27.' },
  
  // String queries
  { query: 'Reverse the string "hello"', expected: 'The result is olleh.' },
  { query: 'What is the length of "test"?', expected: 'The length is 4.' },
  { query: 'Reverse "cat"', expected: 'The result is tac.' },
  
  // Logic queries
  { query: 'Is 42 even?', expected: 'Yes.' },
  { query: 'Is 17 odd?', expected: 'Yes.' },
  { query: 'Is 15 even?', expected: 'No.' },
  
  // General knowledge
  { query: 'What is the capital of France?', expected: 'Paris.' },
  { query: 'Is the sky blue?', expected: 'Yes.' }
];

async function runTests() {
  console.log('Starting tests...\n');
  
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const response = await axios.post(`${BASE_URL}/v1/answer`, {
        query: testCase.query
      });

      const output = response.data.output;
      const success = output === testCase.expected;

      if (success) {
        console.log(`✓ PASS: "${testCase.query}"`);
        console.log(`  Output: ${output}\n`);
        passed++;
      } else {
        console.log(`✗ FAIL: "${testCase.query}"`);
        console.log(`  Expected: ${testCase.expected}`);
        console.log(`  Got: ${output}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ERROR: "${testCase.query}"`);
      console.log(`  ${error.message}\n`);
      failed++;
    }
  }

  console.log('='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));
}

// Run tests
runTests().catch(console.error);
