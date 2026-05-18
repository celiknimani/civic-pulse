const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const bucket = item[key] || 'other';
    if (!acc[bucket]) acc[bucket] = [];
    acc[bucket].push(item);
    return acc;
  }, {});

export const buildChangesetSummary = ({
  context,
  runId,
  acceptedEntries,
  pendingFiles,
  sourcesProcessed,
  analyticsRebuilt = false,
  duplicatesSkipped = 0,
  domains = ['promises', 'deputies'],
}) => {
  const byKind = groupBy(acceptedEntries, 'kind');
  const today = new Date().toISOString().slice(0, 10);
  const domainsLabel = domains.join(' + ');

  const lines = [];
  lines.push(`## Agent run — ${context.country} — ${today}`);
  lines.push('');
  lines.push(`- Run id: \`${runId}\``);
  lines.push(`- Domains: ${domainsLabel}`);
  lines.push(`- Sources scanned: ${sourcesProcessed} of ${context.enabledSources.length}`);
  lines.push(`- Accepted entries (confidence ≥ ${context.options.confidenceThreshold}): ${acceptedEntries.length}`);
  lines.push(`  - Promise updates: ${(byKind.promise_update || []).length}`);
  lines.push(`  - Minister statements: ${(byKind.minister_statement || []).length}`);
  lines.push(`  - Deputy activity: ${(byKind.deputy_activity || []).length}`);
  if (duplicatesSkipped > 0) {
    lines.push(`- Duplicates skipped (already in committed data): ${duplicatesSkipped}`);
  }
  if (domains.includes('deputies')) {
    lines.push(`- Aggregate deputy analytics rebuilt: ${analyticsRebuilt ? 'yes' : 'no'}`);
  }
  lines.push('');

  if (acceptedEntries.length === 0) {
    lines.push('_No entries above the confidence threshold this run._');
    return lines.join('\n');
  }

  const tableFor = (kind, headerCols) => {
    const rows = byKind[kind] || [];
    if (!rows.length) return null;
    const lines = [];
    lines.push(`### ${kind.replace('_', ' ')}`);
    lines.push('');
    lines.push(`| ${headerCols.join(' | ')} |`);
    lines.push(`| ${headerCols.map(() => '---').join(' | ')} |`);
    rows.forEach((entry) => {
      const cells = [];
      if (kind === 'promise_update') {
        cells.push(entry.title || entry.category || '—');
        cells.push(entry.status || '—');
        cells.push(typeof entry.progressDelta === 'number' ? String(entry.progressDelta) : '—');
        cells.push(entry.confidence.toFixed(2));
        cells.push(`\`${entry.source}\``);
      } else if (kind === 'minister_statement') {
        cells.push(entry.ministerName || '—');
        cells.push(entry.topic || '—');
        cells.push(entry.confidence.toFixed(2));
        cells.push(`\`${entry.source}\``);
      } else if (kind === 'deputy_activity') {
        cells.push(entry.deputyName || '—');
        cells.push(entry.topic || '—');
        cells.push(entry.confidence.toFixed(2));
        cells.push(`\`${entry.source}\``);
      }
      lines.push(`| ${cells.join(' | ')} |`);
    });
    return lines.join('\n');
  };

  const promiseTable = tableFor('promise_update', ['Promise', 'Status', 'Δ progress', 'Conf', 'Source']);
  const ministerTable = tableFor('minister_statement', ['Minister', 'Topic', 'Conf', 'Source']);
  const deputyTable = tableFor('deputy_activity', ['Deputy', 'Topic', 'Conf', 'Source']);

  [promiseTable, ministerTable, deputyTable].filter(Boolean).forEach((table) => {
    lines.push('');
    lines.push(table);
  });

  lines.push('');
  lines.push('### Files');
  pendingFiles.forEach((file) => lines.push(`- \`${file}\``));

  lines.push('');
  lines.push('### Review checklist');
  lines.push('- [ ] Each entry\'s `sourceQuote` matches the linked URL.');
  lines.push('- [ ] Status changes reflect what the source actually says.');
  lines.push('- [ ] No fabricated promise ids, deputy names, or dates.');
  lines.push('- [ ] Approved entries moved from `pending/` into the structured data files.');

  return lines.join('\n');
};
