# Quick Start - 5 Minutes to Deploy

## Local Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Test (in new terminal)
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 10 plus 5?"}'
```

Expected output:
```json
{"output": "The answer is 15."}
```

## Deploy to Render (3 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "AI Agent System"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"

### Step 3: Test Deployed API
```bash
curl -X POST https://your-app.onrender.com/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 20 times 3?"}'
```

## Test Examples

```bash
# Math
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Calculate 100 divided by 4"}'

# String
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Reverse the string hello"}'

# Logic
curl -X POST http://localhost:3000/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 42 even?"}'
```

## Run Test Suite

```bash
node test-examples.js
```

## Done! 🎉

Your AI agent is now:
- ✅ Running locally
- ✅ Deployed to production
- ✅ Ready for hackathon evaluation

## API Endpoint

```
POST https://your-app.onrender.com/v1/answer
```

Request:
```json
{"query": "your question here"}
```

Response:
```json
{"output": "answer here"}
```

## Architecture Highlights

- **Agent Loop**: Analyze → Decide → Execute → Format
- **Tool System**: Math, String, Logic (deterministic, fast)
- **LLM Fallback**: Only when tools fail
- **Strict Formatting**: Consistent output format
- **Production Ready**: Never crashes, always returns valid JSON

## Performance

- Tool-based queries: <100ms
- Optimized for similarity scoring
- Low latency, high reliability

## Need Help?

- Full docs: [README.md](README.md)
- Setup guide: [SETUP.md](SETUP.md)
- Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
