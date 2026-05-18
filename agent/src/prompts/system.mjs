export const buildSystemPrompt = ({ skill, context }) => {
  const { config, categories } = context;
  const partyName = config?.trackedParty?.name || 'the tracked party';
  const countryName = config?.name || context.country;

  const categoryLines = categories.map((category) => `- ${category.id} (${category.label})`).join('\n');

  return `You are the civic-pulse ingestion agent operating on data for ${countryName}.

Tracked party: ${partyName}
Country code: ${context.country}
Locale: ${config?.locale || 'en'}

Available category ids (use these exact values when the skill requires a category):
${categoryLines}

Follow the skill instructions below exactly. Respond ONLY with the JSON object the skill specifies. No prose, no markdown fences, no commentary.

--- BEGIN SKILL: ${skill.name} ---
${skill.body}
--- END SKILL ---`;
};
