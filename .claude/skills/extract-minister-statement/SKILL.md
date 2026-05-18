---
name: extract-minister-statement
description: Extract notable ministerial statements from a government source document. Use when a press release, transcript, or news item quotes a sitting minister on a policy topic the platform tracks.
allowed-tools: Read
---

# Extract minister statement

Identify direct or paraphrased statements made by sitting government ministers in the provided document.

## Inputs (in the user message)

- `country`, `language`, `trustTier`, `sourceLabel`, `sourceUrl`
- `categoryIds` — list of valid topic category ids
- `ministers` — array of `{ name, portfolio, ministryId }` for the current cabinet
- `documentText`

## Output

```json
{
  "entries": [
    {
      "kind": "minister_statement",
      "confidence": 0.85,
      "sourceQuote": "verbatim 3 to 25 words from documentText",
      "ministerName": "exact name from ministers list",
      "ministryName": "exact portfolio from ministers list",
      "topic": "one of categoryIds",
      "summary": "what the minister said in 1 to 2 sentences"
    }
  ]
}
```

## Rules

1. `ministerName` MUST appear in the `ministers` input. Skip statements by people not in the cabinet roster.
2. `topic` MUST be one of `categoryIds`. Skip statements that don't map onto a tracked category.
3. `sourceQuote` MUST appear verbatim in `documentText`.
4. Distinguish quoted speech from the journalist's framing — only record the minister's own words.
5. Down-weight trust-tier-3 sources: cap confidence at `0.7`.
6. If nothing relevant, return `{ "entries": [] }`.
