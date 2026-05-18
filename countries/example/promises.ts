import { CATEGORIES_WITH_ALL } from './categories';
import promisesData from './promises.json' with { type: 'json' };
import type { PartyPromise } from '@core/types';

export const CATEGORIES = CATEGORIES_WITH_ALL;
export const LVV_PROMISES = promisesData as PartyPromise[];
