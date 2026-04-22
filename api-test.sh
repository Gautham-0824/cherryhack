#!/bin/bash

# API Test Script
# Usage: ./api-test.sh [URL]
# Example: ./api-test.sh http://localhost:3000
# Example: ./api-test.sh https://your-app.onrender.com

API_URL="${1:-http://localhost:3000}"

echo "Testing AI Agent API at: $API_URL"
echo "========================================"
echo ""

# Health check
echo "1. Health Check"
curl -s "$API_URL/" | jq .
echo ""

# Math tests
echo "2. Math: Addition"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 15 plus 30?"}' | jq .
echo ""

echo "3. Math: Division"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "Calculate 100 divided by 4"}' | jq .
echo ""

echo "4. Math: Multiplication"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 7 times 8?"}' | jq .
echo ""

# String tests
echo "5. String: Reverse"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "Reverse the string hello"}' | jq .
echo ""

echo "6. String: Length"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the length of test?"}' | jq .
echo ""

# Logic tests
echo "7. Logic: Even number"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 42 even?"}' | jq .
echo ""

echo "8. Logic: Odd number"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "Is 17 odd?"}' | jq .
echo ""

# General knowledge
echo "9. General: Capital"
curl -s -X POST "$API_URL/v1/answer" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the capital of France?"}' | jq .
echo ""

echo "========================================"
echo "Testing complete!"
