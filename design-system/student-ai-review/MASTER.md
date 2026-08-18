# Student AI Review Design System

> Global visual source of truth for the Vietnamese high-school revision chatbot.
> Page-specific overrides belong in `design-system/student-ai-review/pages/`.

**Project:** Student AI Review  
**Page:** Chat workspace  
**Audience:** Vietnamese students in Grades 10-12  
**Platform:** Responsive web  
**Style direction:** Classroom workspace, editorial clarity, calm utility

## Product Intent

StudyMate should feel like a dependable study desk: focused, welcoming, and easy to scan. The conversation is the primary content; grade, subject, and topic are visible context rather than a settings maze.

## Design Principles

- Lead with the student's next learning action.
- Use navy ink for trust, teal for focus, and coral only for meaningful feedback.
- Keep AI output on a quiet paper-like surface with generous line height.
- Use solid surfaces, borders, and restrained shadows to create hierarchy.
- Do not use AI-purple gradients, glassmorphism, decorative blobs, or emoji icons.
- Keep controls native and labelled so keyboard and screen-reader users can follow the same path.

## Color Tokens

| Role | Hex | CSS Variable |
|---|---|---|
| Ink / primary | `#1F4E79` | `--color-primary` |
| Ink strong | `#153956` | `--color-primary-strong` |
| Focus teal | `#0F766E` | `--color-accent` |
| Focus teal strong | `#0B5D57` | `--color-accent-strong` |
| Teal soft | `#DFF3F0` | `--color-accent-soft` |
| Student blue | `#2456A6` | `--color-student` |
| Student blue soft | `#EAF2FF` | `--color-student-soft` |
| Page background | `#F7FBFF` | `--color-background` |
| Surface | `#FFFFFF` | `--color-surface` |
| Surface soft | `#F8FBFD` | `--color-surface-soft` |
| Text | `#132238` | `--color-text` |
| Supporting text | `#405064` | `--color-subtle` |
| Muted text | `#6B7B8F` | `--color-muted` |
| Border | `#D8E3EF` | `--color-border` |
| Error | `#B42318` | `--color-error` |

Text and interactive states must maintain at least 4.5:1 contrast. Color never carries meaning alone; status also uses labels, icons, or shape.

## Typography

| Role | Font | Size / line-height | Weight |
|---|---|---|---|
| Display heading | Be Vietnam Pro | `clamp(2rem, 3.2vw, 3.2rem)` / `1.12` | 800 |
| Section heading | Be Vietnam Pro | `1.25rem-1.7rem` / `1.2` | 700-800 |
| Body and chat | Noto Sans | `1rem` / `1.5-1.65` | 400-500 |
| Labels | Noto Sans | `0.8rem-0.95rem` / `1.4` | 700-800 |

Be Vietnam Pro supports Vietnamese headings with a clear, confident rhythm. Noto Sans keeps educational explanations neutral and readable. Never use body text below 16px on mobile.

## Spacing And Shape

- Base spacing scale: 4 / 8 / 12 / 16 / 18 / 22 / 28 / 32px.
- Small control radius: 10px.
- Medium surface radius: 16px.
- Major panel radius: 24px on desktop, 18px on mobile.
- Interactive target minimum: 44px high.
- Reading line length: keep explanatory copy near 65-75 characters where possible.

## Layout

- Desktop: two-column workspace with a 290-410px context panel and flexible conversation panel.
- Tablet: stack context above conversation at 1040px.
- Mobile: stack all controls, preserve 16px body text, and make the send action full width.
- Conversation scrolls inside its panel on desktop and returns to natural page flow on mobile.
- Avoid horizontal overflow and preserve visible focus rings.

## Component Rules

### Context Panel

Use one clear title, visible labels for Grade, Subject, and Topic, and a brief helper line explaining why the context matters. Required fields show `*`; optional topic shows `Không bắt buộc`.

### Conversation

AI messages use white surfaces with a book-mark avatar and a left-tail radius. Student messages use solid student blue and right alignment. Keep author labels visible and preserve line breaks in AI output.

### Quick Actions

Use three bordered actions: `Tóm tắt chủ đề`, `Giải thích dễ hiểu`, and `Tạo 5 câu trắc nghiệm`. Use one consistent inline SVG icon per action and keep them subordinate to the message composer.

### Composer

The composer is the primary action. Keep a visible label for assistive technology, a 48px input, a labelled `Gửi câu hỏi` button, Enter helper text, and disabled/loading feedback during requests.

### Feedback

Errors use `role="alert"`, an icon, clear Vietnamese recovery language, and placement adjacent to the workspace. Loading uses a stable AI bubble with a three-dot typing indicator.

## Motion

- Use 150-250ms color, border, and shadow transitions for controls.
- Reserve continuous animation for the typing indicator.
- Use `prefers-reduced-motion: reduce` to disable non-essential movement.
- Do not animate layout dimensions or shift adjacent controls on hover.

## Accessibility Checklist

- Keyboard order follows context, quick actions, conversation, then composer.
- Every form field has a visible label or a screen-reader label.
- Focus rings are visible and use the teal focus token.
- Live conversation status uses `aria-live="polite"`; loading uses `aria-busy`.
- Error feedback uses text plus icon, never color alone.
- Test at 375px, 768px, 1024px, and 1440px, including reduced motion.
