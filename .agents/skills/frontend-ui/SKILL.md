---
name: frontend-ui
description: |-
  Use this skill when creating, reviewing, or modifying the React user interface,
  chat experience, responsive layout, forms, loading states, error states, or
  accessibility of the student AI revision chatbot.
disable-model-invocation: false
---

# Frontend UI

## Purpose

Build a clear, friendly, responsive, and easy-to-use interface for the student
AI revision chatbot.

The interface is intended primarily for students.

The UI should feel modern and educational without becoming visually complex.

---

## Core UX Goal

A student should understand how to start using the chatbot without needing
instructions.

The primary action should always be obvious:

Ask a question or start a revision activity.

---

## Main Screen

The main chatbot screen should normally contain:

1. application identity;
2. subject selection when required;
3. grade selection when required;
4. optional topic selection;
5. conversation area;
6. message input;
7. send action;
8. loading feedback;
9. error feedback.

Do not overload the initial screen with unnecessary settings.

---

## Suggested Layout

A simple structure:

Header

Subject / Grade / Topic controls

Chat conversation

Message input

Optional quick actions

Examples of quick actions:

- Review a topic
- Create a quiz
- Explain a concept
- Practice questions

Quick actions should help students start, not replace the normal chat input.

---

## Component Responsibilities

Prefer small components with clear purposes.

Examples:

### ChatPage

Coordinates the main chatbot screen.

It may manage:

- conversation state;
- selected subject;
- selected grade;
- current topic;
- loading state;
- API interaction through a service.

Do not place all markup and logic into one very large component.

### ChatMessage

Displays a single message.

It should clearly distinguish:

- student messages;
- AI messages;
- system/error information when needed.

### ChatInput

Responsible for:

- message input;
- send button;
- Enter key behavior;
- disabled state during invalid submission.

### SubjectSelector

Allows selection of a subject.

### GradeSelector

Allows selection of grade level.

### QuizCard

Displays a generated quiz question when structured quiz UI is used.

---

## Chat Behavior

Messages must be visually distinguishable by sender.

Student messages should clearly appear as student input.

AI responses should clearly appear as assistant output.

Preserve line breaks in educational explanations when useful.

Support common content such as:

- paragraphs;
- lists;
- question choices;
- simple emphasis.

Do not render raw HTML returned by the AI.

---

## Message Input

The input should:

- have a clear placeholder;
- support keyboard input;
- prevent sending an empty message;
- disable submission while appropriate;
- provide visible focus state.

Example placeholder:

Ask a question about your lesson...

Pressing Enter may send the message.

If multiline input is supported:

- Enter sends;
- Shift+Enter creates a new line.

Use whichever behavior is already established in the application.

---

## Loading State

AI requests are not instantaneous.

Always communicate that the system is processing.

Examples:

- typing indicator;
- spinner;
- "AI is thinking..." text.

While waiting:

- prevent duplicate submission when necessary;
- keep existing conversation visible;
- do not make the interface appear frozen.

Do not fake completed AI responses.

---

## Error State

Errors must be visible and understandable.

Example:

Unable to get a response right now. Please try again.

Avoid showing technical messages such as:

- HTTP 500 stack trace;
- provider exception;
- raw JSON errors.

Provide a retry opportunity when practical.

---

## Empty State

Before the first conversation, provide helpful guidance.

Example:

What would you like to review today?

Suggested prompts may include:

- Explain fractions to me.
- Quiz me on the solar system.
- Help me review photosynthesis.
- Give me five practice questions.

Keep suggestions concise.

---

## Subject and Grade Selection

If the chatbot behavior depends on subject or grade, make the current
selection visible.

Do not silently change the selected subject or grade.

If no selection is required, avoid forcing unnecessary form fields.

---

## Quiz UI

When showing multiple-choice questions:

- display the question clearly;
- display all options consistently;
- make options easy to click or select;
- do not reveal the correct answer before submission;
- clearly display feedback after submission;
- prevent accidental repeated scoring.

Correctness should not rely only on color.

Also use text or icons such as:

Correct

Try again

This improves accessibility.

---

## Educational Feedback

Feedback should be easy to scan.

For an incorrect answer, distinguish:

1. result;
2. correct concept;
3. explanation;
4. optional next action.

Do not display an excessively large paragraph when a shorter explanation is
sufficient.

---

## Responsive Design

The application should remain usable on:

- desktop;
- tablet;
- mobile.

Avoid fixed widths that cause horizontal scrolling.

The chat area should adapt to available screen width.

On smaller screens:

- controls may stack vertically;
- buttons must remain tappable;
- text must remain readable;
- input must remain accessible when the keyboard is open.

---

## Accessibility

Use semantic HTML wherever possible.

Examples:

- button for buttons;
- label for form controls;
- proper heading order;
- form elements for input.

Interactive elements should support keyboard navigation.

Provide accessible labels for icon-only buttons.

Do not rely exclusively on:

- color;
- hover;
- icons without text or accessible labels.

Maintain adequate contrast.

---

## Typography

Use readable text sizes.

Educational explanations should prioritize readability over decorative
typography.

Avoid:

- very small body text;
- excessive uppercase;
- overly decorative fonts;
- large blocks of dense text.

Use spacing and hierarchy to separate:

- question;
- answer choices;
- explanation;
- next action.

---

## Visual Style

Prefer a clean educational visual style.

Use a limited, consistent design system for:

- spacing;
- border radius;
- typography;
- button styles;
- cards;
- input fields.

Do not randomly introduce new visual styles for each component.

If the existing project already has a visual system, preserve it.

---

## Icons

Icons may support understanding but should not replace essential labels unless
the meaning is universally clear and accessible.

Do not fill the interface with decorative icons.

---

## Animation

Animations should be subtle and functional.

Appropriate examples:

- loading indicator;
- message appearance;
- small button state transition.

Avoid animations that distract students from learning content.

---

## React Rules

Use React state appropriately.

Avoid direct DOM manipulation unless genuinely necessary.

Use stable keys when rendering message lists.

Keep derived values out of state when they can be calculated from existing
state.

Avoid unnecessary useEffect logic.

Do not introduce premature optimization.

---

## API Calls

UI components should not contain repeated low-level API request code.

Prefer calling a service such as:

chatService.sendMessage(...)

Handle:

- loading;
- success;
- error.

Ensure loading state is reset in both success and failure paths.

---

## Safe Rendering

Treat AI-generated content as untrusted text.

Do not use dangerouslySetInnerHTML for AI responses unless there is a
specific sanitized implementation and a strong reason.

Prefer safe text or controlled Markdown rendering.

---

## User Experience Rules

Do not:

- clear the conversation after an error;
- lose the student's typed message unnecessarily;
- allow duplicate messages caused by repeated button clicks;
- disable the entire interface without explanation;
- hide important errors;
- reveal internal AI prompts.

---

## Scope Rule

When asked to modify one UI feature:

- inspect the existing design first;
- preserve unrelated UI;
- avoid rewriting the whole interface;
- reuse existing components where appropriate.

---

## Quality Check

Before completing frontend UI work, verify:

- the primary action is obvious;
- empty messages cannot be submitted;
- loading state is visible;
- errors are understandable;
- student and AI messages are clearly distinguishable;
- subject and grade selections remain clear;
- quiz answers are not leaked before submission;
- mobile layout remains usable;
- keyboard interaction works;
- interactive controls have accessible labels;
- no API secret appears in frontend code;
- AI-generated content is rendered safely;
- the UI remains consistent with the existing project.
