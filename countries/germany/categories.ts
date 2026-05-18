import definitions from './categories.json' with { type: 'json' };
import config from './config.json' with { type: 'json' };
import {
  buildCategoriesWithAll,
  buildCategoryViews,
  buildDeputyTopicTaxonomy,
  type CategoryDefinition,
} from '@core/categories';

const CATEGORY_DEFINITIONS = definitions as CategoryDefinition[];

export const PLATFORM_CATEGORIES = buildCategoryViews(CATEGORY_DEFINITIONS);
export const CATEGORIES_WITH_ALL = buildCategoriesWithAll(
  CATEGORY_DEFINITIONS,
  config.categoryAllLabel || 'Alle',
  'fa-layer-group',
);
export const DEPUTY_TOPIC_TAXONOMY = buildDeputyTopicTaxonomy(CATEGORY_DEFINITIONS);
