---
name: project-architecture
description: |-
  Use this skill when creating, reviewing, or modifying the overall architecture,
  project structure, module boundaries, data flow, API contracts, or technical
  organization of the student AI revision chatbot.
disable-model-invocation: false
---

# Project Architecture

## Purpose

Maintain a simple, secure, and maintainable architecture for the student AI
revision chatbot.

The project is an educational AI application. Architecture decisions should
prioritize clarity, security, maintainability, and ease of demonstration.

Do not introduce unnecessary complexity.

---

## Core Architecture

Use a client-server architecture.

Required flow:

Student
→ Frontend
→ Backend API
→ AI Provider
→ Backend
→ Frontend

The frontend must not communicate directly with an AI provider using a secret
API key.

---

## Recommended Technology Stack

### Frontend

Use:

- React
- Vite
- JavaScript or the language already used by the existing project
- CSS or the styling solution already used by the project
- Fetch API or Axios for HTTP requests

Do not add a new frontend framework unless explicitly requested.

### Backend

Use the backend technology already selected by the project.

If no backend exists yet, prefer a small and simple backend suitable for the
project.

The backend is responsible for:

- request validation;
- AI provider communication;
- prompt construction;
- secret management;
- error handling;
- response normalization.

### AI Provider

Use the AI provider already configured by the project.

Examples:

- Gemini
- OpenAI

Do not switch AI providers unless explicitly requested.

---

## Project Structure

Keep responsibilities separated.

A recommended frontend structure is:

src/
├── components/
├── pages/
├── services/
├── hooks/
├── utils/
├── constants/
├── App.jsx
└── main.jsx

Suggested responsibilities:

### components

Reusable UI components.

Examples:

- ChatMessage
- ChatInput
- SubjectSelector
- GradeSelector
- QuizCard
- LoadingIndicator
- ErrorMessage

### pages

Page-level components.

Examples:

- ChatPage
- HomePage

Do not put large amounts of business logic directly inside page components.

### services

Communication with backend APIs.

Example:

services/chatService.js

The service layer should contain HTTP request logic rather than duplicating
fetch or Axios calls throughout UI components.

### hooks

Reusable React stateful logic when necessary.

Do not create custom hooks for trivial logic.

### utils

Small reusable pure helper functions.

### constants

Reusable fixed values such as:

- supported subjects;
- grade options;
- API endpoint names;
- UI limits.

Do not store API secrets here.

---

## Backend Structure

Keep backend responsibilities clearly separated.

A recommended structure is:

src/
├── controllers/
├── services/
├── routes/
├── middleware/
├── config/
├── utils/
└── server entry point

Depending on the backend framework, equivalent naming is acceptable.

### Routes

Define API endpoints.

Routes should not contain AI provider implementation details.

### Controllers

Receive requests and produce HTTP responses.

Controllers should:

1. receive validated or raw request data;
2. call the appropriate service;
3. return a normalized response.

Avoid placing complex prompt-building or AI logic inside controllers.

### Services

Contain application and AI integration logic.

Examples:

- ChatService
- QuizService
- AIService

### Middleware

Use for cross-cutting concerns when needed.

Examples:

- validation;
- error handling;
- request logging.

Do not add middleware merely for architectural appearance.

---

## Core API

The main chatbot endpoint may use:

POST /api/chat

Example request:

{
  "subject": "Mathematics",
  "grade": "6",
  "topic": "Fractions",
  "message": "Help me revise fractions"
}

Example successful response:

{
  "success": true,
  "message": "..."
}

Example error response:

{
  "success": false,
  "message": "Unable to process the request."
}

Use a consistent response shape throughout the application.

---

## Quiz API

If quiz functionality requires a dedicated endpoint, prefer:

POST /api/quiz/generate

Example:

{
  "subject": "Mathematics",
  "grade": "6",
  "topic": "Fractions",
  "questionCount": 5,
  "difficulty": "medium"
}

Do not create separate endpoints unnecessarily if the existing chatbot
endpoint can safely and clearly support the functionality.

---

## State Management

Start with React local state where possible.

Use:

- useState;
- useReducer;
- Context only when genuinely shared state requires it.

Do not introduce Redux, Zustand, MobX, or another state management library
unless project complexity justifies it or the user explicitly requests it.

For this educational MVP, simple state management is preferred.

---

## Database

Do not introduce a database unless a feature actually requires persistent
storage.

A basic chatbot demo does not require a database.

Features that may later require persistence include:

- user accounts;
- chat history across sessions;
- saved quizzes;
- student progress;
- teacher-created materials.

Do not build these features unless requested.

---

## Security Boundaries

Never expose:

- AI provider API keys;
- backend secrets;
- system prompts containing sensitive configuration;
- server environment variables.

Secrets belong on the server.

Never hard-code credentials in source files.

Use environment variables.

Example:

AI_API_KEY=...

Do not commit .env files containing real secrets.

Provide .env.example when appropriate.

---

## Input Validation

Validate data at the backend boundary.

At minimum validate:

- message is present;
- message is a string;
- message is not excessively long;
- subject is supported when required;
- grade is valid when required;
- question count is within an allowed range.

Frontend validation improves user experience but does not replace backend
validation.

---

## Error Handling

Errors should follow a predictable flow.

Frontend
← safe API error
← backend error handler
← service/provider failure

Users should receive understandable messages.

Do not expose:

- stack traces;
- raw provider errors containing secrets;
- internal server paths;
- environment variables.

Log technical details on the server when appropriate.

---

## Simplicity Rule

This project is an educational AI chatbot, not an enterprise platform.

Prefer the simplest architecture that satisfies the requirements.

Avoid adding without clear need:

- microservices;
- message queues;
- distributed caching;
- multiple databases;
- complex authentication;
- container orchestration;
- event-driven architecture.

Complexity must solve a real project requirement.

---

## Modification Rules

Before changing architecture:

1. Inspect the current project structure.
2. Identify existing conventions.
3. Preserve working patterns when reasonable.
4. Avoid rewriting unrelated modules.
5. Explain significant architectural changes.
6. Keep changes scoped to the requested task.

Do not redesign the entire project to solve a small feature.

---

## Dependency Rules

Before adding a new dependency:

1. Check whether the requirement can be solved with existing dependencies.
2. Confirm the dependency provides meaningful value.
3. Avoid overlapping libraries solving the same problem.
4. Use maintained and appropriate packages.

Do not add dependencies merely for convenience if native functionality is
sufficient.

---

## Quality Check

Before completing architecture-related work, verify:

- frontend and backend responsibilities are separated;
- the AI API key remains server-side;
- HTTP calls are centralized appropriately;
- components do not contain unnecessary backend logic;
- API request and response structures are consistent;
- validation exists at the backend boundary;
- errors are handled safely;
- no unnecessary architectural complexity was introduced;
- existing working code was preserved wherever possible.
