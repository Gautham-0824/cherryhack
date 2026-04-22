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
    const { query } = req.body;
    
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

    // Process through agent
    const output = await processQuery(sanitizedQuery);

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
