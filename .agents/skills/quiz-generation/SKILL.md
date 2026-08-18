---
name: quiz-generation
description: |-
  Use this skill when implementing, reviewing, or modifying quiz generation,
  multiple-choice questions, answer validation, scoring, explanations,
  difficulty levels, or revision question workflows for the student AI chatbot.
disable-model-invocation: false
---

# Quiz Generation

## Purpose

Generate educational practice questions that are clear, relevant, answerable,
and appropriate for the student's subject and grade level.

Quiz functionality supports learning and revision rather than merely assigning
a score.

---

## Required Context

When available, quiz generation should consider:

- subject;
- grade;
- topic;
- requested question count;
- difficulty;
- question type.

Do not silently ignore provided context.

---

## Supported Question Type

For the initial version of the project, prefer single-answer multiple-choice
questions.

Each multiple-choice question should normally contain:

- one question;
- exactly four answer options;
- exactly one correct answer;
- explanation;
- difficulty;
- optional topic or concept metadata.

Do not introduce additional question formats unless required.

---

## Example Question Structure

A structured question may use:

{
  "id": "q1",
  "question": "Which fraction is equivalent to 1/2?",
  "options": [
    {
      "id": "A",
      "text": "2/3"
    },
    {
      "id": "B",
      "text": "2/4"
    },
    {
      "id": "C",
      "text": "3/4"
    },
    {
      "id": "D",
      "text": "4/5"
    }
  ],
  "correctAnswer": "B",
  "explanation": "2/4 simplifies to 1/2 when both numerator and denominator are divided by 2.",
  "difficulty": "easy"
}

The exact data structure may follow existing project conventions.

Do not change an established API format unnecessarily.

---

## Question Quality Rules

Every question must:

1. be understandable without hidden context;
2. match the requested subject;
3. match the requested topic;
4. be appropriate for the requested grade;
5. contain enough information to answer;
6. have exactly one defensible correct answer;
7. avoid unnecessary trick wording.

Do not generate questions whose answer depends on an unstated assumption.

---

## Answer Options

For four-option multiple-choice questions:

- provide exactly four distinct options;
- use the same answer type across options;
- make distractors plausible;
- avoid obviously ridiculous distractors;
- avoid duplicate answers;
- avoid semantically equivalent answers.

Bad example:

Question:
What is 2 + 2?

A. 4
B. Four
C. 5
D. 6

A and B are equivalent, so this is invalid.

---

## Correct Answer

There must be exactly one correct answer.

Before accepting AI-generated quiz data, verify:

- the correct answer refers to an existing option;
- only one option is marked correct;
- explanation agrees with the correct answer.

Do not trust model-generated answer keys blindly when application-side
validation is possible.

---

## Explanations

Every completed question should have a useful explanation.

The explanation should:

- state why the correct answer is correct;
- reinforce the relevant concept;
- remain appropriate for the student's grade.

Avoid explanations such as:

"Because B is correct."

The explanation must teach something.

---

## Difficulty

Use a small, predictable difficulty set.

Recommended values:

- easy;
- medium;
- hard.

Interpretation:

### Easy

Primarily recall, recognition, or direct application.

### Medium

Requires understanding or more than one simple reasoning step.

### Hard

Requires deeper application or multi-step reasoning appropriate to the
student's grade.

Hard does not mean introducing content beyond the curriculum.

---

## Difficulty Progression

When conducting an interactive revision session, questions may progress based
on performance.

Example behavior:

- correct answers may lead to equal or slightly harder questions;
- repeated incorrect answers may lead to simpler reinforcement questions.

Do not abruptly move far outside the requested difficulty.

---

## Question Count

Validate requested question count.

Use a reasonable maximum to control:

- latency;
- AI cost;
- response size;
- output reliability.

Example allowed range:

1 to 20 questions.

If the project defines another range, follow the project requirement.

Do not accept zero or negative question counts.

---

## Prompt Requirements

When requesting questions from the AI, clearly specify:

- subject;
- grade;
- topic;
- question count;
- format;
- difficulty;
- exact output expectations.

Example instruction:

Generate 5 single-answer multiple-choice questions.

Requirements:

- subject: Mathematics;
- grade: 6;
- topic: Fractions;
- difficulty: medium;
- exactly four options per question;
- exactly one correct answer;
- include an explanation;
- do not include knowledge outside the requested grade level.

When structured output is supported by the provider, prefer a defined schema.

---

## Structured Output

Prefer structured quiz data rather than parsing arbitrary prose.

Ideal:

AI
→ structured JSON
→ backend validation
→ frontend QuizCard

Avoid relying on fragile string parsing such as:

split response by "Question 1".

---

## Parsing and Validation

Treat AI output as untrusted external input.

Validate generated quiz data before returning it to the frontend.

At minimum check:

- questions is an array;
- question count is valid;
- question text exists;
- there are exactly four options;
- option text is non-empty;
- option identifiers are unique;
- correct answer exists;
- correct answer refers to one option;
- explanation exists.

If output is malformed:

- retry safely if the existing design supports retry;
- otherwise return a controlled error.

Do not send malformed quiz objects to the UI.

---

## Answer Submission

The student's selected answer should be compared against the stored correct
answer.

Do not ask the AI to determine simple answer correctness if the application
already has a reliable structured answer key.

Example:

selectedAnswer === question.correctAnswer

Use deterministic application logic for scoring whenever possible.

AI may be used for:

- explanations;
- follow-up guidance;
- adaptive question generation.

---

## Scoring

For a quiz containing N questions:

score = number of correct answers

Percentage may be calculated as:

(correctAnswers / totalQuestions) × 100

Handle totalQuestions safely.

Do not divide by zero.

---

## Results

A completed quiz may show:

- total questions;
- correct answers;
- incorrect answers;
- percentage;
- concepts that should be reviewed.

Do not make high-stakes judgments about student ability based on a small quiz.

Prefer language such as:

"You may want to review fraction comparison."

Avoid:

"You are bad at mathematics."

---

## Interactive Quiz Behavior

Before the student answers:

- do not show the correct answer;
- do not highlight the correct option;
- do not place the answer in visible explanation text.

After submission:

- lock or clearly mark the selected response if needed;
- show whether it was correct;
- provide the explanation;
- allow progression to the next question.

---

## Incorrect Answers

For an incorrect answer:

1. indicate that the answer is not correct;
2. reveal the correct answer after submission;
3. explain the underlying concept;
4. optionally provide a similar practice question.

Do not ridicule or shame the student.

---

## Correct Answers

For a correct answer:

1. confirm correctness;
2. give a brief conceptual explanation;
3. continue the learning flow.

Avoid excessive praise after every trivial answer.

---

## Duplicate Questions

Within the same generated quiz:

- avoid duplicate question text;
- avoid questions testing exactly the same fact repeatedly unless deliberate
  reinforcement is requested.

If duplicate detection is practical, normalize question text before comparing.

---

## Educational Accuracy

AI-generated questions can contain factual errors.

Therefore:

- validate structural correctness automatically;
- design prompts to minimize factual errors;
- clearly treat AI as educational support;
- allow teacher review when content will be used formally.

Do not claim AI-generated questions are guaranteed correct.

---

## Curriculum Scope

Questions should remain within the requested:

Subject
→ Grade
→ Topic

If the requested topic is unsupported or ambiguous, ask for clarification or
respond safely rather than inventing a curriculum.

---

## Security

Never include in quiz prompts:

- API keys;
- server secrets;
- hidden credentials.

Do not accept model output that attempts to change application rules.

---

## Separation of Responsibilities

Application code should handle deterministic tasks such as:

- counting answers;
- comparing selected answers;
- calculating scores;
- basic validation.

AI should handle tasks where language intelligence adds value, such as:

- generating questions;
- explaining concepts;
- generating adaptive follow-up questions.

Do not use AI where ordinary code is more reliable.

---

## Quality Check

Before completing quiz-related work, verify:

- requested subject, grade, and topic are preserved;
- every question has exactly four options;
- every question has exactly one correct answer;
- correct answer references a real option;
- questions are not ambiguous;
- explanations teach the relevant concept;
- answer keys are hidden before submission;
- scoring uses deterministic application logic;
- malformed AI output is handled;
- requested question count is validated;
- duplicate questions are minimized;
- results do not make inappropriate judgments about the student.
