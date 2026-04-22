# API Examples - Request/Response Patterns

## Complete Request/Response Examples

### Math Operations

#### Addition
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 15 plus 30?"}'
```

**Response:**
```json
{
  "output": "The answer is 45."
}
```

---

#### Subtraction
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 50 minus 23?"}'
```

**Response:**
```json
{
  "output": "The answer is 27."
}
```

---

#### Multiplication
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 7 times 8?"}'
```

**Response:**
```json
{
  "output": "The answer is 56."
}
```

---

#### Division
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Calculate 100 divided by 4"}'
```

**Response:**
```json
{
  "output": "The answer is 25."
}
```

---

### String Operations

#### Reverse String
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Reverse the string \"hello\""}'
```

**Response:**
```json
{
  "output": "The result is olleh."
}
```

---

#### String Length
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the length of \"test\"?"}'
```

**Response:**
```json
{
  "output": "The length is 4."
}
```

---

#### Reverse Another String
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Reverse cat"}'
```

**Response:**
```json
{
  "output": "The result is tac."
}
```

---

### Logic Operations

#### Even Number Check
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 42 even?"}'
```

**Response:**
```json
{
  "output": "Yes."
}
```

---

#### Odd Number Check
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 17 odd?"}'
```

**Response:**
```json
{
  "output": "Yes."
}
```

---

#### Even Number Check (False)
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 15 even?"}'
```

**Response:**
```json
{
  "output": "No."
}
```

---

### General Knowledge

#### Capital City
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the capital of France?"}'
```

**Response:**
```json
{
  "output": "Paris."
}
```

---

#### Yes/No Question
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Is the sky blue?"}'
```

**Response:**
```json
{
  "output": "Yes."
}
```

---

### Error Cases

#### Empty Query
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

**Response:**
```json
{
  "error": "Query cannot be empty."
}
```

---

#### Missing Query Field
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "error": "Invalid request. Query must be a non-empty string."
}
```

---

#### Unknown Query (Fallback)
**Request:**
```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the meaning of life?"}'
```

**Response:**
```json
{
  "output": "Unable to answer."
}
```

---

## JavaScript/Node.js Examples

### Using Axios

```javascript
const axios = require('axios');

async function askAgent(query) {
  try {
    const response = await axios.post('http://localhost:3000/v1/answer', {
      query: query
    });
    console.log('Answer:', response.data.output);
    return response.data.output;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Examples
askAgent('What is 10 plus 5?');
askAgent('Reverse the string hello');
askAgent('Is 42 even?');
```

---

### Using Fetch (Browser/Node 18+)

```javascript
async function askAgent(query) {
  const response = await fetch('http://localhost:3000/v1/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  
  const data = await response.json();
  return data.output;
}

// Example
askAgent('What is 7 times 8?').then(console.log);
```

---

## Python Examples

### Using Requests

```python
import requests

def ask_agent(query):
    response = requests.post(
        'http://localhost:3000/v1/answer',
        json={'query': query}
    )
    return response.json()['output']

# Examples
print(ask_agent('What is 15 plus 30?'))
print(ask_agent('Reverse the string hello'))
print(ask_agent('Is 42 even?'))
```

---

## Response Format Patterns

### Math Responses
- Pattern: `"The answer is {number}."`
- Examples:
  - `"The answer is 45."`
  - `"The answer is 25."`
  - `"The answer is 56."`

### String Responses
- Pattern: `"The result is {string}."` or `"The length is {number}."`
- Examples:
  - `"The result is olleh."`
  - `"The length is 4."`

### Logic Responses
- Pattern: `"Yes."` or `"No."`
- Examples:
  - `"Yes."`
  - `"No."`

### General Knowledge Responses
- Pattern: `"{answer}."` or `"Yes."` / `"No."`
- Examples:
  - `"Paris."`
  - `"Yes."`

### Fallback Response
- Pattern: `"Unable to answer."`
- Used when: Query cannot be processed by any tool or reasoning module

---

## Testing Different Query Formats

### Math - Various Formats

```bash
# Word-based
{"query": "What is 10 plus 5?"}
{"query": "Calculate 20 minus 8"}
{"query": "What is 6 times 7?"}

# Symbol-based
{"query": "10 + 5"}
{"query": "20 - 8"}
{"query": "6 * 7"}

# Mixed
{"query": "What is 10 + 5?"}
{"query": "Calculate 20 * 3"}
```

### String - Various Formats

```bash
# With quotes
{"query": "Reverse the string \"hello\""}
{"query": "What is the length of \"test\"?"}

# Without quotes
{"query": "Reverse hello"}
{"query": "Length of test"}
```

### Logic - Various Formats

```bash
# Even/Odd
{"query": "Is 42 even?"}
{"query": "Is 17 odd?"}
{"query": "42 even?"}

# Comparisons
{"query": "Is 10 greater than 5?"}
{"query": "Is 3 less than 8?"}
```

---

## Performance Benchmarks

### Tool-Based Queries (Fast)
- Math: ~10-30ms
- String: ~5-20ms
- Logic: ~5-15ms

### Reasoning Queries (Medium)
- General knowledge: ~20-50ms

### LLM Fallback (Slow)
- Unknown queries: ~500-2000ms

---

## Integration Examples

### Express.js Integration

```javascript
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/ask', async (req, res) => {
  const query = req.query.q;
  
  const response = await axios.post('http://localhost:3000/v1/answer', {
    query: query
  });
  
  res.json(response.data);
});

app.listen(8080);
```

### React Integration

```javascript
import { useState } from 'react';

function AgentChat() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const askAgent = async () => {
    const response = await fetch('http://localhost:3000/v1/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    setAnswer(data.output);
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={askAgent}>Ask</button>
      <p>Answer: {answer}</p>
    </div>
  );
}
```

---

## Health Check

**Request:**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "status": "ok",
  "message": "AI Agent System Running"
}
```

---

## Summary

- **Endpoint**: `POST /v1/answer`
- **Request Format**: `{"query": "string"}`
- **Response Format**: `{"output": "string"}`
- **Consistent Output**: Always formatted, no explanations
- **Never Crashes**: Always returns valid JSON
- **Fast**: <100ms for tool-based queries
