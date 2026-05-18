# Accessibility

civic-pulse targets **WCAG 2.2 AA** on every route.

## Automated coverage

`scripts/check-accessibility-browser.mjs` serves `dist/` over a built-in HTTP server, drives Chromium via Playwright, and runs `@axe-core/playwright` against each sample route **after** JavaScript has hydrated. This catches interactive-state issues (focus rings, ARIA live regions, hover/disabled contrast, `<select>` accessible names) that a static HTML audit cannot see.

The audit covers `/`, `/methodology`, `/about`, `/privacy`, `/contact`, `/deputetet`, `/qeveria`. CI runs it after `npm run build` on the `example` matrix slot (the in-repo English reference dataset).

```bash
npm run a11y          # full browser audit (requires `npx playwright install chromium` once)
npm run build         # also runs the bundle budget check
```

### Rules in scope

We run the `wcag2a`, `wcag2aa`, and `wcag22aa` rule sets — about 90 checks. The high-impact ones the browser audit catches:

- `select-name`, `label`, `button-name`, `link-name`
- `color-contrast` (with the actual rendered colors at the actual viewport size)
- `landmark-one-main`, `region`, `bypass`
- `aria-allowed-attr`, `aria-required-attr`, `aria-roles`, `aria-required-children`
- `image-alt`, `role-img-alt`
- `heading-order`, `page-has-heading-one`
- `html-has-lang`, `valid-lang`, `document-title`
- `meta-viewport` (no `user-scalable=no`)

### Known minor violations (allowlisted)

Two color-contrast violations on inherited classes (`.mt-1` on `/methodology` eyebrow text, `.mt-3` on `/qeveria` ministry sub-label) have nuanced root causes — they're flagged on wrapper elements where axe can't pin the exact offending text. They're acknowledged in `ALLOWED_VIOLATIONS` in `scripts/check-accessibility-browser.mjs`. Track upstream fixes in the comment next to each entry; remove the allowlist entry once fixed.

### Adding a new known-failure

When you have to land a change with a known a11y regression:

1. Open `scripts/check-accessibility-browser.mjs`.
2. Add an entry to `ALLOWED_VIOLATIONS` with `{ route, ruleId, selectorIncludes }`.
3. Add an inline comment linking to the tracking issue.
4. Remove the entry once the issue is fixed.

## Dynamic-state manual checklist

The automated audit covers the rule-based checks. These need a human:

### Keyboard

- [ ] Tab order matches visual order on every primary route.
- [ ] Every interactive element (button, link, input, select, slider, modal trigger) has a visible focus indicator.
- [ ] No focus traps outside intentional modals. `Esc` closes any modal.
- [ ] Skip-link present on routes with a long header (currently the home page).

### Screen reader

- [ ] Test with VoiceOver (macOS) or NVDA (Windows) on the home page.
- [ ] Hero stats are announced as a list, not as a single string.
- [ ] Status badges (Completed / In Progress / Delayed / Pending) announce their localized labels — not the English ids.
- [ ] Recent-entry cards announce the promise title and status.
- [ ] Radar chart in DeputyProfile has a text alternative (currently the topics table to the right of the SVG).

### Forms (admin editor)

- [ ] Every input has an associated `<label>` (already enforced by the editor components).
- [ ] Form errors are announced via text + color.
- [ ] PAT input in `AuthGate` is `type="password"` and `autocomplete="off"`.

### Motion

- [ ] No animation longer than 5 seconds repeats without a pause control.
- [ ] `prefers-reduced-motion` is respected — currently we only use short hover transforms and progress bar transitions, which honor the OS reduced-motion setting via CSS defaults.

## Local debug

```bash
npm run build
npm run a11y -- --routes /,/methodology       # just two routes
AGENT_DEBUG=true npm run a11y                 # verbose
```

If a violation is flagged on an elusive selector like `.mt-1`, run the audit interactively:

```bash
npx serve dist
# In another tab, open the route in Chromium with the axe extension installed,
# then inspect the offending element. Cross-reference the React component file.
```
