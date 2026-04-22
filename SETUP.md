# Complete Setup Guide

## Project Structure

```
ai-agent-system/
├── index.js              # Express API server
├── agent.js              # Main agent loop
├── analyzer.js           # Intent detection
├── formatter.js          # Output formatting
├── llm.js               # LLM fallback
├── tools/
│   ├── math.js          # Math operations
│   ├── string.js        # String operations
│   └── logic.js         # Logic operations
├── package.json
├── test-examples.js     # Test suite
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

## Installation Steps

### 1. Install Node.js

Ensure Node.js 14+ is installed:
```bash
node --version
```

If not installed, download from: https://nodejs.org/

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `express`: Web server framework
- `axios`: HTTP client for LLM calls

### 3. Configure Environment (Optional)

Create `.env` file for LLM API keys:

```bash
# For OpenAI
OPENAI_API_KEY=sk-your-key-here

# OR for Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Note**: System works without API keys using deterministic tools.

### 4. Start the Server

```bash
npm start
```

Output:
```
AI Agent System running on port 3000
Endpoint: POST /v1/answer
```

### 5. Test Locally

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 10 plus 5?"}'
```

Expected response:
```json
{
  "output": "The answer is 15."
}
```

### 6. Run Test Suite

```bash
node test-examples.js
```

This runs multiple test cases and shows pass/fail results.

## How It Works

### Agent Loop Flow

1. **Request arrives** at `/v1/answer`
2. **Analyzer** detects intent (math, string, logic, general)
3. **Agent** decides which tool to use
4. **Tool executes** deterministically (no AI)
5. **If tool fails**, LLM fallback is used
6. **Formatter** ensures strict output format
7. **Response** returned as JSON

### Example Flow: Math Query

```
Query: "What is 15 plus 30?"
  ↓
Analyzer: Detects "math" intent, extracts [15, 30], operation "add"
  ↓
Agent: Routes to math tool
  ↓
Math Tool: Calculates 15 + 30 = 45
  ↓
Formatter: Formats as "The answer is 45."
  ↓
Response: {"output": "The answer is 45."}
```

### Example Flow: String Query

```
Query: "Reverse the string 'hello'"
  ↓
Analyzer: Detects "string" intent, operation "reverse", target "hello"
  ↓
Agent: Routes to string tool
  ↓
String Tool: Reverses "hello" → "olleh"
  ↓
Formatter: Formats as "The result is olleh."
  ↓
Response: {"output": "The result is olleh."}
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Render

1. Push to GitHub
2. Connect to Render
3. Deploy with one click
4. Get your public URL

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=8080 npm start
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Not Responding

1. Check server is running: `curl http://localhost:3000/`
2. Check logs for errors
3. Verify JSON format in request

### Tests Failing

1. Ensure server is running
2. Check BASE_URL in test-examples.js
3. Review server logs for errors

## Performance Optimization

### Tool Priority
Tools are tried in this order:
1. Math tool (fastest)
2. String tool (fast)
3. Logic tool (fast)
4. Reasoning module (medium)
5. LLM fallback (slowest)

### Latency Targets
- Tool-based queries: <50ms
- Reasoning queries: <100ms
- LLM fallback: <2000ms

### Optimization Tips
1. Add caching for repeated queries
2. Pre-compile regex patterns
3. Use connection pooling for LLM
4. Implement request queuing

## API Reference

### POST /v1/answer

**Request:**
```json
{
  "query": "string (required)"
}
```

**Response:**
```json
{
  "output": "string"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid request
- `500`: Server error (returns "Unable to answer.")

### GET /

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "AI Agent System Running"
}
```

## Development

### Adding New Tools

1. Create tool file in `tools/` directory
2. Implement `execute(query, metadata)` function
3. Add intent detection in `analyzer.js`
4. Add tool routing in `agent.js`
5. Add formatting rules in `formatter.js`

### Example: Adding a Date Tool

```javascript
// tools/date.js
function execute(query, metadata) {
  const now = new Date();
  return {
    success: true,
    answer: now.toISOString()
  };
}

module.exports = { execute };
```

## Security

- Input sanitization enabled
- No `eval()` usage
- Safe regex patterns
- Environment variables for secrets
- Error handling prevents crashes

## Support

For issues or questions:
1. Check logs for error messages
2. Review README.md and DEPLOYMENT.md
3. Test with example queries
4. Verify all dependencies installed

## License

MIT
