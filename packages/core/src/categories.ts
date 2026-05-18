export interface CategoryDefinition {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export interface CategoryView {
  id: string;
  label: string;
  icon: string;
}

export interface DeputyTopicTaxonomyEntry {
  topicId: string;
  label: string;
  keywords: string[];
}

export const buildCategoryViews = (definitions: CategoryDefinition[]): CategoryView[] =>
  definitions.map(({ id, label, icon }) => ({ id, label, icon }));

export const buildCategoriesWithAll = (
  definitions: CategoryDefinition[],
  allLabel = 'All',
  allIcon = 'fa-layer-group',
): CategoryView[] => [
  { id: 'all', label: allLabel, icon: allIcon },
  ...buildCategoryViews(definitions),
];

export const buildDeputyTopicTaxonomy = (definitions: CategoryDefinition[]): DeputyTopicTaxonomyEntry[] =>
  definitions.map(({ id, label, keywords }) => ({
    topicId: id,
    label,
    keywords: [...keywords],
  }));
