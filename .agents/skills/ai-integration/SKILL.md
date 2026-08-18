---
name: ai-integration
description: |-
  Use this skill when implementing or reviewing backend integration with an AI
  provider such as Gemini or OpenAI for the student revision chatbot.
disable-model-invocation: false
---

# AI Integration

## Architecture

Frontend must never call the AI provider using a secret API key.

Required flow:

Student
→ Frontend
→ Backend API
→ AI Provider
→ Backend
→ Frontend

## Secrets

- Store API keys in environment variables.
- Never commit API keys.
- Never hard-code secrets.
- Never expose secrets through frontend environment variables.

## Backend responsibilities

The backend must:

- validate incoming requests;
- build the system instruction;
- send the request to the AI provider;
- handle provider errors;
- normalize the response;
- return safe error messages to the frontend.

## Suggested request

POST /api/chat

{
  "subject": "Mathematics",
  "grade": "6",
  "topic": "Fractions",
  "message": "Help me revise fractions"
}

## Suggested response

{
  "message": "...",
  "success": true
}

## Validation

Reject:

- empty messages;
- excessively long messages;
- invalid grade values;
- malformed requests.

## Error handling

Handle:

- network failure;
- provider timeout;
- invalid API key;
- rate limit;
- malformed AI response.

Never expose provider stack traces or API credentials to users.
