import definitions from './categories.json' with { type: 'json' };
import config from './config.json' with { type: 'json' };
import promisesData from './promises.json' with { type: 'json' };
import {
  buildCategoriesWithAll,
  buildCategoryViews,
  type CategoryDefinition,
} from '@core/categories';
import type { PartyPromise } from '@core/types';

const CATEGORY_DEFINITIONS = definitions as CategoryDefinition[];

export const PLATFORM_CATEGORIES = buildCategoryViews(CATEGORY_DEFINITIONS);
export const CATEGORIES_WITH_ALL = buildCategoriesWithAll(
  CATEGORY_DEFINITIONS,
  config.categoryAllLabel || 'Alle',
  'fa-layer-group',
);

export const CATEGORIES = CATEGORIES_WITH_ALL;
export const LVV_PROMISES = promisesData as PartyPromise[];
