# AI Agent System - Production Ready

A complete, production-ready AI agent system with tool usage, reasoning, and strict output formatting for hackathon deployment.

## Architecture

```
/project
├── index.js          # Express API server
├── agent.js          # Main agent loop (decision-making)
├── analyzer.js       # Intent detection
├── formatter.js      # Strict output formatting
├── llm.js           # LLM fallback module
├── tools/
│   ├── math.js      # Deterministic math operations
│   ├── string.js    # String manipulation
│   └── logic.js     # Logic operations
├── package.json
└── README.md
```

## Features

### Agent Loop
- **Analyze**: Detect query intent (math, string, logic, general)
- **Decide**: Choose appropriate tool or reasoning module
- **Execute**: Run deterministic tools (fast, reliable)
- **Fallback**: Use LLM only when tools fail
- **Format**: Strict output formatting for consistency

### Tool System
1. **Math Tool**: Addition, subtraction, multiplication, division
2. **String Tool**: Reverse, length, case conversion
3. **Logic Tool**: Even/odd, comparisons, boolean logic

### Output Format
- Consistent phrasing
- No explanations
- Single string responses
- Examples:
  - "The answer is 25."
  - "Yes."
  - "No."
  - "The result is tac."

## API Endpoint

### POST /v1/answer

**Request:**
```json
{
  "query": "What is 15 plus 30?"
}
```

**Response:**
```json
{
  "output": "The answer is 45."
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional)

For LLM fallback, set one of:

```bash
# OpenAI
export OPENAI_API_KEY=your_key_here

# OR Anthropic
export ANTHROPIC_API_KEY=your_key_here
```

**Note**: The system works without LLM keys using deterministic tools and reasoning.

### 3. Run Locally

```bash
npm start
```

Server runs on `http://localhost:3000`

### 4. Test the API

```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 10 plus 5?"}'
```

## Deployment to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: ai-agent-system
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variables (optional):
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
6. Click "Create Web Service"

### Step 3: Get Your URL

Render will provide a URL like:
```
https://ai-agent-system.onrender.com
```

### Step 4: Test Deployed API

```bash
curl -X POST https://ai-agent-system.onrender.com/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 20 times 3?"}'
```

## Example Queries

### Math
```json
{"query": "What is 15 plus 30?"}
// Output: "The answer is 45."

{"query": "Calculate 100 divided by 4"}
// Output: "The answer is 25."
```

### String
```json
{"query": "Reverse the string 'hello'"}
// Output: "The result is olleh."

{"query": "What is the length of 'test'?"}
// Output: "The length is 4."
```

### Logic
```json
{"query": "Is 42 even?"}
// Output: "Yes."

{"query": "Is 17 odd?"}
// Output: "Yes."
```

### General Knowledge
```json
{"query": "What is the capital of France?"}
// Output: "Paris."

{"query": "Is the sky blue?"}
// Output: "Yes."
```

## Performance

- **Latency**: <100ms for tool-based queries
- **Optimization**: Deterministic tools preferred over LLM
- **Reliability**: Never crashes, always returns valid JSON
- **Fallback**: "Unable to answer." for unsolvable queries

## Robustness

- Input validation and sanitization
- Error handling at every layer
- Graceful degradation
- Timeout handling for LLM calls
- Always returns valid JSON response

## Logging

All queries and responses are logged with timestamps:
```
[2026-04-22T10:30:45.123Z] Query: What is 5 plus 3?
[2026-04-22T10:30:45.125Z] Output: The answer is 8.
```

## License

MIT
