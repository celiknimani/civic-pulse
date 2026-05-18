const VALID_KINDS = new Set(['promise_update', 'minister_statement', 'deputy_activity']);
const VALID_STATUSES = new Set(['Completed', 'In Progress', 'Delayed', 'Pending']);

export const validateEntry = (entry, { categoryIds, sourceText }) => {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    return { ok: false, errors: ['entry is not an object'] };
  }

  if (!VALID_KINDS.has(entry.kind)) {
    errors.push(`invalid kind: ${entry.kind}`);
  }

  if (typeof entry.confidence !== 'number' || entry.confidence < 0 || entry.confidence > 1) {
    errors.push(`confidence must be a number in [0,1], got ${entry.confidence}`);
  }

  if (typeof entry.sourceQuote !== 'string' || entry.sourceQuote.length < 6) {
    errors.push('sourceQuote missing or too short');
  } else if (sourceText && !sourceText.includes(entry.sourceQuote.trim())) {
    errors.push('sourceQuote does not appear verbatim in source content');
  }

  if (entry.kind === 'promise_update') {
    if (entry.category && categoryIds.size && !categoryIds.has(entry.category)) {
      errors.push(`unknown category: ${entry.category}`);
    }
    if (entry.status && !VALID_STATUSES.has(entry.status)) {
      errors.push(`invalid status: ${entry.status}`);
    }
  }

  if (entry.kind === 'minister_statement' && !entry.ministerName) {
    errors.push('minister_statement requires ministerName');
  }

  if (entry.kind === 'deputy_activity' && !entry.deputyName) {
    errors.push('deputy_activity requires deputyName');
  }

  return { ok: errors.length === 0, errors };
};

export const filterValidEntries = (entries, options) => {
  const accepted = [];
  const rejected = [];
  entries.forEach((entry) => {
    const result = validateEntry(entry, options);
    if (result.ok) accepted.push(entry);
    else rejected.push({ entry, errors: result.errors });
  });
  return { accepted, rejected };
};
