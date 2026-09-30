# Headless Execution Example

This document demonstrates running a scoped Claude task without supervision, using only pre-approved tools.

## Setup

```bash
cd C:\Users\basti\OneDrive - INGENIERIA Y DISEÑO ELECTRONO I&DE S.A\Escritorio\Programas\kodre\claude-wire-into-your-stack
```

## Task: Create a reviews resource route

```bash
claude -p \
  --allowedTools Read,Write,Edit,Bash \
  "Create a new route file routes/reviews.js for a reviews resource with:
   - GET / to list all reviews
   - GET /:id to fetch one review with 404 handling  
   - POST / to create a review (require rating and text)
   - PUT /:id to update a review
   
   Follow the Express Route Pattern skill. Update server.js to mount it.
   Add a test file tests/reviews.test.js with basic tests.
   Do not modify any other files."
```

## Why these tools?

- `Read` — examine existing routes and store.js
- `Write` — create new files (reviews.js, reviews.test.js)
- `Edit` — modify store.js and server.js
- `Bash` — run npm test to verify

## What's prevented?

- Delete operations
- Random file edits outside the scope
- Publishing to external services
- Dangerous shell commands

## Execution flow

1. Claude reads existing routes to understand conventions
2. Creates routes/reviews.js following the same pattern
3. Updates db/store.js with review storage functions
4. Mounts in server.js
5. Creates tests/reviews.test.js
6. Runs npm test to verify all tests pass
7. Reports completion

## Result

No human had to review intermediate steps. The Express Route Pattern skill and error-format hook ensure consistency. The tight allowedTools set means only intended operations could happen.

## Verification

Run: `npm test` — should show all tests passing including new reviews tests.

## Compare to supervised

This is the same work that could take 10+ minutes with human reviews at each step. With scoped tools and the project wiring in place, it's instant and safe.
