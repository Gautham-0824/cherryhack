# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (HTTP Request)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│                     (index.js)                               │
│  • Input Validation                                          │
│  • Sanitization                                              │
│  • Error Handling                                            │
│  • Logging                                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT CONTROLLER                           │
│                     (agent.js)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AGENT LOOP:                                         │   │
│  │  1. Analyze Query                                    │   │
│  │  2. Detect Intent                                    │   │
│  │  3. Decide Action                                    │   │
│  │  4. Execute Tool/Reasoning                           │   │
│  │  5. Validate Result                                  │   │
│  │  6. Format Output                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      ANALYZER                                │
│                    (analyzer.js)                             │
│  • Intent Detection (math, string, logic, general)          │
│  • Metadata Extraction (numbers, operations, targets)       │
│  • Pattern Matching (regex-based)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│   TOOL SYSTEM    │          │    REASONING     │
│                  │          │     MODULE       │
│  ┌────────────┐ │          │                  │
│  │ Math Tool  │ │          │  • Simple logic  │
│  │ (math.js)  │ │          │  • Patterns      │
│  └────────────┘ │          │  • Heuristics    │
│                  │          │                  │
│  ┌────────────┐ │          └──────────────────┘
│  │String Tool │ │                   │
│  │(string.js) │ │                   │
│  └────────────┘ │                   │
│                  │                   │
│  ┌────────────┐ │                   │
│  │Logic Tool  │ │                   │
│  │(logic.js)  │ │                   │
│  └────────────┘ │                   │
└────────┬─────────┘                   │
         │                             │
         │         ┌───────────────────┘
         │         │
         │         │  (If tools/reasoning fail)
         │         │
         └─────────┼─────────┐
                   │         │
                   ▼         ▼
         ┌──────────────────────────┐
         │     LLM FALLBACK         │
         │       (llm.js)           │
         │  • OpenAI API            │
         │  • Anthropic API         │
         │  • Low Temperature       │
         │  • Timeout Protection    │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │      FORMATTER           │
         │    (formatter.js)        │
         │  • Strict Formatting     │
         │  • Consistent Phrasing   │
         │  • Output Cleanup        │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │    JSON RESPONSE         │
         │  {"output": "answer"}    │
         └──────────────────────────┘
```

## Agent Loop Flow

```
START
  │
  ▼
┌─────────────────────┐
│  Receive Query      │
│  "What is 10+5?"    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  STEP 1: ANALYZE    │
│  • Parse query      │
│  • Detect intent    │
│  • Extract metadata │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Intent: MATH       │
│  Numbers: [10, 5]   │
│  Operation: add     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  STEP 2: DECIDE     │
│  • Check intent     │
│  • Select tool      │
│  • Route request    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Decision: Use      │
│  Math Tool          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  STEP 3: EXECUTE    │
│  • Call math tool   │
│  • Calculate result │
│  • Return value     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Result: 15         │
│  Success: true      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  STEP 4: VALIDATE   │
│  • Check success    │
│  • Verify result    │
└──────────┬──────────┘
           │
           ├─── Success ───┐
           │                │
           │                ▼
           │    ┌─────────────────────┐
           │    │  STEP 5: FORMAT     │
           │    │  • Apply rules      │
           │    │  • Clean output     │
           │    └──────────┬──────────┘
           │               │
           │               ▼
           │    ┌─────────────────────┐
           │    │  Output:            │
           │    │  "The answer is 15."│
           │    └──────────┬──────────┘
           │               │
           │               ▼
           │            RETURN
           │
           └─── Failure ───┐
                           │
                           ▼
                ┌─────────────────────┐
                │  LLM FALLBACK       │
                │  • Call LLM API     │
                │  • Get response     │
                └──────────┬──────────┘
                           │
                           ▼
                        FORMAT
                           │
                           ▼
                        RETURN
```

## Tool System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TOOL INTERFACE                        │
│  execute(query, metadata) → {success, answer, error}    │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│   MATH TOOL      │ │ STRING TOOL  │ │  LOGIC TOOL  │
├──────────────────┤ ├──────────────┤ ├──────────────┤
│ • Addition       │ │ • Reverse    │ │ • Even/Odd   │
│ • Subtraction    │ │ • Length     │ │ • Compare    │
│ • Multiplication │ │ • Uppercase  │ │ • Greater    │
│ • Division       │ │ • Lowercase  │ │ • Less       │
│ • Expression     │ │ • Capitalize │ │ • Equal      │
│   Evaluation     │ │              │ │ • Prime      │
└──────────────────┘ └──────────────┘ └──────────────┘
```

## Intent Detection Flow

```
Query Input
    │
    ▼
┌─────────────────────┐
│  Pattern Matching   │
│  • Math keywords    │
│  • String keywords  │
│  • Logic keywords   │
│  • Numbers present  │
│  • Symbols present  │
└──────────┬──────────┘
           │
           ├─── Has numbers + math keywords ───► MATH INTENT
           │
           ├─── Has string keywords ───────────► STRING INTENT
           │
           ├─── Has logic keywords ────────────► LOGIC INTENT
           │
           └─── None of above ─────────────────► GENERAL INTENT
```

## Data Flow Example: Math Query

```
1. REQUEST
   POST /v1/answer
   {"query": "What is 15 plus 30?"}
   
2. API LAYER
   ✓ Validate: query is string
   ✓ Sanitize: trim whitespace
   ✓ Log: incoming query
   
3. AGENT CONTROLLER
   State: {
     query: "What is 15 plus 30?",
     intent: null,
     steps: [],
     result: null
   }
   
4. ANALYZER
   Detect: "plus" keyword
   Extract: numbers [15, 30]
   Intent: {
     type: "math",
     metadata: {
       operation: "add",
       numbers: [15, 30]
     }
   }
   
5. AGENT DECISION
   Intent type: "math"
   → Route to Math Tool
   
6. MATH TOOL
   Operation: add
   Calculate: 15 + 30 = 45
   Return: {
     success: true,
     answer: 45
   }
   
7. FORMATTER
   Input: 45
   Intent: math
   Format: "The answer is 45."
   
8. RESPONSE
   {"output": "The answer is 45."}
```

## Error Handling Flow

```
┌─────────────────┐
│  Any Error      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Try-Catch      │
│  Block          │
└────────┬────────┘
         │
         ├─── Tool Error ────► Try LLM Fallback
         │
         ├─── LLM Error ─────► Return "Unable to answer."
         │
         ├─── Format Error ──► Return "Unable to answer."
         │
         └─── Server Error ──► Return "Unable to answer."
                                (Never crash)
```

## Performance Optimization Strategy

```
Query Received
    │
    ▼
┌─────────────────────┐
│  Fast Path          │
│  (Deterministic)    │
│  ~10-50ms           │
│                     │
│  • Math Tool        │
│  • String Tool      │
│  • Logic Tool       │
└──────────┬──────────┘
           │
           ├─── Success ───► Format ───► Return
           │
           ▼
┌─────────────────────┐
│  Medium Path        │
│  (Reasoning)        │
│  ~20-100ms          │
│                     │
│  • Pattern Match    │
│  • Heuristics       │
│  • Simple Logic     │
└──────────┬──────────┘
           │
           ├─── Success ───► Format ───► Return
           │
           ▼
┌─────────────────────┐
│  Slow Path          │
│  (LLM Fallback)     │
│  ~500-2000ms        │
│                     │
│  • API Call         │
│  • Wait Response    │
│  • Parse Result     │
└──────────┬──────────┘
           │
           └─── Always ───► Format ───► Return
```

## Module Dependencies

```
index.js
  └── agent.js
       ├── analyzer.js
       ├── formatter.js
       ├── llm.js
       └── tools/
            ├── math.js
            ├── string.js
            └── logic.js
```

## State Management

```
Agent State Object:
{
  query: "original query string",
  intent: {
    type: "math|string|logic|general",
    metadata: {
      operation: "add|subtract|...",
      numbers: [1, 2, 3],
      target: "string target",
      values: [...]
    }
  },
  steps: [
    "Intent detected: math",
    "Used math tool",
    "Tool succeeded"
  ],
  result: "final answer"
}
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           GitHub Repository              │
│  • Source code                           │
│  • package.json                          │
│  • Documentation                         │
└────────────────┬────────────────────────┘
                 │
                 │ (Connected)
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Render.com Platform              │
│  ┌─────────────────────────────────┐   │
│  │  Build Process                   │   │
│  │  1. npm install                  │   │
│  │  2. Verify dependencies          │   │
│  └─────────────────────────────────┘   │
│                                          │
│  ┌─────────────────────────────────┐   │
│  │  Runtime Environment             │   │
│  │  • Node.js 14+                   │   │
│  │  • Express server                │   │
│  │  • PORT from env                 │   │
│  └─────────────────────────────────┘   │
│                                          │
│  ┌─────────────────────────────────┐   │
│  │  Public URL                      │   │
│  │  https://app.onrender.com        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                 │
                 │ (Accessible via)
                 │
                 ▼
┌─────────────────────────────────────────┐
│         API Consumers                    │
│  • Test scripts                          │
│  • Evaluation systems                    │
│  • Client applications                   │
└─────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Input Layer                      │
│  • Type validation                       │
│  • Length checks                         │
│  • Sanitization (trim)                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Processing Layer                 │
│  • No eval()                             │
│  • Safe regex                            │
│  • Bounded operations                    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         External Layer                   │
│  • Environment variables                 │
│  • Timeout protection                    │
│  • Error isolation                       │
└─────────────────────────────────────────┘
```

## Scalability Considerations

```
Current: Single Instance
┌─────────────────┐
│  Express Server │
│  (1 instance)   │
└─────────────────┘

Future: Horizontal Scaling
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
┌────┐ ┌────┐ ┌────┐
│ S1 │ │ S2 │ │ S3 │
└────┘ └────┘ └────┘

With Caching:
┌─────────────────┐
│  Redis Cache    │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
┌────┐ ┌────┐ ┌────┐
│ S1 │ │ S2 │ │ S3 │
└────┘ └────┘ └────┘
```
