---
name: extract-deputy-activity
description: Extract parliamentary speech and voting activity for tracked deputies from a parliament transcript or session document. Use for plenary transcripts, committee minutes, or roll-call votes where you need to attribute statements and decisions to specific members.
allowed-tools: Read
---

# Extract deputy activity

Identify interventions, votes, or substantive parliamentary contributions by deputies on tracked topics.

## Inputs (in the user message)

- `country`, `language`, `trustTier`, `sourceLabel`, `sourceUrl`
- `categoryIds` — valid topic ids
- `deputies` — array of `{ id, name, party }` for the tracked roster
- `documentText`

## Output

```json
{
  "entries": [
    {
      "kind": "deputy_activity",
      "confidence": 0.82,
      "sourceQuote": "verbatim 3 to 25 words from documentText",
      "deputyName": "exact name from deputies list",
      "deputyId": "id from deputies list",
      "topic": "one of categoryIds or null",
      "activityType": "speech" | "vote" | "question" | "motion",
      "summary": "what they did in 1 to 2 sentences"
    }
  ]
}
```

## Rules

1. `deputyName` and `deputyId` MUST resolve to a single entry in `deputies`. If a name is ambiguous (two deputies share a surname), use `confidence ≤ 0.4` and include both candidates as separate entries.
2. `topic` is the **primary** topic of the intervention. If the intervention spans multiple, pick the dominant one. `null` is acceptable for procedural interventions.
3. `sourceQuote` MUST appear verbatim in `documentText`.
4. Don't double-count: a single speech is one entry, even if it touches multiple categories.
5. Don't fabricate `activityType` — if you can't tell whether it was a speech vs. a question, use `speech` and lower confidence by `0.1`.
6. If nothing relevant, return `{ "entries": [] }`.
