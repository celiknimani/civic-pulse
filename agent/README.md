# civic-pulse ingestion agent

A Claude-backed process that scans official government and parliament sources defined in `countries/<COUNTRY>/sources.yaml`, extracts structured promise / minister / deputy updates with citations, and opens a pull request for human review.

See [docs/AGENT.md](../docs/AGENT.md) for the full architecture, tuning, prompts, and PR workflow.

## Quick reference

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...
export GITHUB_REPOSITORY=org/repo
export COUNTRY=example

npm run agent                # show help
npm run agent:promises       # Promises Tracker only (gov press, gazette, ministerials)
npm run agent:deputies       # Deputy Performance Tracker only (transcripts + analytics rebuild)
npm run agent:run            # umbrella — both trackers in sequence
npm run agent:dry-run        # umbrella, write to pending/ but skip PR
npm run agent -- run --source <id>     # one-source debug
npm run agent -- validate              # lint sources.yaml without fetching
npm run agent -- skills                # list available skills
npm run agent:score-verdict -- <countryRoot> <runId> <prNumber>
                                # post-merge verdict scoring
```

## Code layout

```
agent/src/
├── cli.mjs                       # entry point, command parsing
├── agents/
│   ├── ingestion.mjs             # cron orchestrator (deterministic loop)
│   ├── chunk-document.mjs        # split long docs into overlapping windows + merge
│   ├── verdict.mjs               # post-merge scoring → per-source confidence multiplier
│   ├── dedupe.mjs                # skip entries already in committed data
│   ├── extraction-schema.mjs     # JSON validator
│   └── changeset-summary.mjs     # PR body builder
├── config/
│   ├── load.mjs                  # country config + sources.yaml + env
│   └── skills.mjs                # parses .claude/skills/<name>/SKILL.md
├── prompts/
│   └── system.mjs                # assembles country context + skill body
└── tools/
    ├── fetch-cache.mjs           # ETag/Last-Modified cache helpers
    ├── fetch-html.mjs            # HTML → plain text, cache-aware
    ├── fetch-rss.mjs             # RSS/Atom parser, cache-aware
    ├── fetch-pdf.mjs             # PDF text extraction via pdf-parse, cache-aware
    ├── fetch-search.mjs          # web search via Anthropic / Brave
    ├── open-pull-request.mjs     # branch + commit + push + open PR via GitHub API
    ├── write-changeset.mjs       # persist pending JSON
    └── index.mjs                 # createSdkMcpServer bundle (Claude Agent SDK)
```

The extraction prompts themselves live in `.claude/skills/` (markdown with YAML frontmatter) — the agent loads them by name. The subagent definitions live in `.claude/agents/` and are spawnable from Claude Code.

## Status

Current — landed in v1.1:

- ✅ Two focused subagents (Promises Tracker, Deputy Performance Tracker) + umbrella.
- ✅ HTML / RSS / PDF (via `pdf-parse`) / web-search (Anthropic `web_search` or Brave) adapters.
- ✅ ETag / Last-Modified fetch cache with `--force-refresh` opt-out.
- ✅ Long-document chunking with overlap and confidence-aware merging.
- ✅ Verdict scoring → per-source × skill confidence multiplier.
- ✅ Deduplication against existing `promises.json` updates and `transcripts/*.json`.
- ✅ Auto-rebuild of `public/data/deputies-analytics.json` when the deputies domain produces entries.

Open — see [docs/ROADMAP.md](../docs/ROADMAP.md):

- OAuth for the `/admin` GitHub-PR editor (currently PAT only).
- Conflict detection in github-pr saves.
- Verdict scoring UI inside `/admin`.
