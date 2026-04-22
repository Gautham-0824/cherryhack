# Deployment Guide

## Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier works)

### Steps

1. **Prepare Repository**
```bash
git init
git add .
git commit -m "AI Agent System - Production Ready"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy on Render**
   - Visit https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: `ai-agent-system`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Environment Variables (Optional)**
   - Add `OPENAI_API_KEY` if using OpenAI
   - Add `ANTHROPIC_API_KEY` if using Anthropic
   - System works without these using deterministic tools

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Get your URL: `https://your-service.onrender.com`

### Test Deployment

```bash
curl -X POST https://your-service.onrender.com/v1/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 10 plus 5?"}'
```

Expected response:
```json
{
  "output": "The answer is 15."
}
```

## Alternative: Deploy to Railway

1. Visit https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js
5. Add environment variables if needed
6. Deploy automatically

## Alternative: Deploy to Heroku

```bash
heroku create ai-agent-system
git push heroku main
heroku open
```

## Health Check

All deployments expose a health check endpoint:

```bash
curl https://your-service.onrender.com/
```

Response:
```json
{
  "status": "ok",
  "message": "AI Agent System Running"
}
```

## Monitoring

Check logs on Render:
- Go to your service dashboard
- Click "Logs" tab
- Monitor incoming queries and responses

## Troubleshooting

### Issue: Service not responding
- Check logs for errors
- Verify PORT environment variable is not hardcoded
- Ensure `process.env.PORT` is used

### Issue: Slow responses
- Check if LLM fallback is being used too often
- Verify tools are working correctly
- Consider adding caching

### Issue: Invalid responses
- Check input validation
- Review formatter.js logic
- Verify tool outputs

## Production Checklist

- ✅ Server uses `process.env.PORT`
- ✅ Error handling on all routes
- ✅ Input validation and sanitization
- ✅ Logging enabled
- ✅ Health check endpoint
- ✅ Never crashes (always returns valid JSON)
- ✅ Graceful LLM fallback
- ✅ No hardcoded dependencies

## Performance Tips

1. **Use tools first**: Deterministic tools are 10x faster than LLM
2. **Cache common queries**: Add Redis for frequently asked questions
3. **Optimize regex**: Pre-compile regex patterns in analyzer
4. **Connection pooling**: Reuse HTTP connections for LLM calls
5. **Rate limiting**: Add rate limiting for production use

## Security

- Input sanitization enabled
- No eval() usage
- Safe regex patterns
- Environment variables for secrets
- CORS can be added if needed:

```javascript
const cors = require('cors');
app.use(cors());
```

## Scaling

For high traffic:
1. Upgrade Render instance type
2. Add Redis caching
3. Implement request queuing
4. Use load balancing
5. Add CDN for static assets

## Cost Optimization

- Free tier sufficient for hackathon
- Tools reduce LLM API costs
- Upgrade only if needed
- Monitor usage in Render dashboard
