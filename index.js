/**
 * API Layer - Express Server
 * Handles HTTP requests and routes to agent controller
 */

const express = require('express');
const { processQuery } = require('./agent');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AI Agent System Running' });
});

// Main agent endpoint
app.post('/v1/answer', async (req, res) => {
  try {
    const { query, assets } = req.body;
    
    // Validate input
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request. Query must be a non-empty string.' 
      });
    }

    // Sanitize input
    const sanitizedQuery = query.trim();
    
    if (sanitizedQuery.length === 0) {
      return res.status(400).json({ 
        error: 'Query cannot be empty.' 
      });
    }

    // Log incoming query
    console.log(`[${new Date().toISOString()}] Query: ${sanitizedQuery}`);
    if (assets && assets.length > 0) {
      console.log(`[${new Date().toISOString()}] Assets: ${assets.join(', ')}`);
    }

    // Fetch asset content if URLs are provided
    let assetContext = '';
    if (Array.isArray(assets) && assets.length > 0) {
      assetContext = await fetchAssets(assets);
    }

    // Process through agent (pass asset context alongside query)
    const output = await processQuery(sanitizedQuery, assetContext);

    // Log response
    console.log(`[${new Date().toISOString()}] Output: ${output}`);

    // Return response
    res.json({ output });

  } catch (error) {
    console.error('Error processing query:', error);
    
    // Never crash - always return valid response
    res.json({ output: 'Unable to answer.' });
  }
});

/**
 * Fetch text content from asset URLs
 * Returns concatenated text to use as context
 */
async function fetchAssets(urls) {
  const axios = require('axios');
  const results = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        // Accept text content only
        headers: { 'Accept': 'text/plain, text/html, application/json, */*' },
        // Limit response size to avoid huge payloads
        maxContentLength: 50000
      });

      let content = '';
      if (typeof response.data === 'string') {
        // Strip HTML tags if present, keep readable text
        content = response.data
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 2000); // cap per asset
      } else if (typeof response.data === 'object') {
        content = JSON.stringify(response.data).slice(0, 2000);
      }

      if (content) results.push(content);
    } catch (err) {
      console.error(`Failed to fetch asset ${url}: ${err.message}`);
    }
  }

  return results.join('\n\n');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.json({ output: 'Unable to answer.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Agent System running on port ${PORT}`);
  console.log(`Endpoint: POST /v1/answer`);
});
