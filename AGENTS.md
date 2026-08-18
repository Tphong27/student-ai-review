# Student AI Review - Agent Instructions

## Project Purpose

Build a web-based AI revision chatbot for Vietnamese high-school students.

Target users:

- Grade 10
- Grade 11
- Grade 12

The AI acts as a learning assistant that helps students:

- review lessons;
- ask questions;
- summarize topics;
- receive simple explanations;
- generate revision questions.

The AI supports learning and does not replace teachers or textbooks.

## MVP Scope

The MVP must support:

1. Select grade:
   - Grade 10
   - Grade 11
   - Grade 12

2. Select subject.

3. Optionally enter a study topic.

4. Ask questions through a chatbot interface.

5. AI answers according to:
   - selected grade;
   - selected subject;
   - selected topic.

6. Quick actions:
   - Summarize this topic
   - Explain this topic simply
   - Create 5 multiple-choice revision questions

7. Loading state.

8. Safe error handling.

Do not implement features outside this scope unless explicitly requested.

## Supported Subjects

For the MVP:

- Mathematics
- Literature
- English
- Physics
- Chemistry
- Biology
- History
- Geography

## Technology Stack

Frontend:

- React
- Vite
- JavaScript

Backend:

- Node.js
- Express

AI Provider:

- Google Gemini

Communication:

- REST API

Database:

- No database for the MVP.

## Architecture

Required flow:

Student
→ React frontend
→ Express backend
→ Gemini API
→ Express backend
→ React frontend

The frontend must never directly expose or use the Gemini API key.

## Security

- Never hard-code API keys.
- Use backend environment variables.
- Never commit real .env secrets.
- Create .env.example.
- Never expose stack traces or secrets to frontend users.

## Development Rules

Before modifying code:

1. Inspect the existing project.
2. Read AGENTS.md.
3. Read relevant skills under .agents/skills.
4. Preserve working code when possible.
5. Keep changes scoped to the requested task.

After modifying code:

1. Check for obvious errors.
2. Run relevant tests when available.
3. Run frontend build.
4. Verify backend startup.
5. Report honestly what was and was not verified.

## AI Behavior

The AI must:

- support Vietnamese high-school students;
- adapt explanations to Grade 10, 11, or 12;
- respect the selected subject and topic;
- use clear educational language;
- provide examples when useful;
- avoid pretending uncertain information is definitely correct;
- explain mistakes when appropriate.

## Quiz Behavior

For the MVP:

- multiple-choice only;
- exactly four options;
- exactly one correct answer;
- do not reveal the correct answer before the student responds;
- provide explanations after answering.

For the fastest MVP, quiz questions may initially be shown directly inside the chat response.

Do not build a complex quiz engine unless explicitly requested.

## UI

Keep the interface:

- simple;
- modern;
- student-friendly;
- responsive;
- easy to demonstrate.

Do not over-design the application.

## Scope Control

Prefer a small working product over a large incomplete product.

Do not introduce:

- authentication;
- registration;
- database;
- Redux;
- teacher dashboard;
- saved history;
- file upload;
- voice features;
- microservices;
- complex infrastructure;

unless explicitly requested.
