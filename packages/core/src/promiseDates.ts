import { PartyPromise, PromiseUpdate } from './types';

type DatedEntry = {
  date: string;
};

export const getDateTimestamp = (value?: string): number => {
  const timestamp = Date.parse(value || '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const compareDatedEntriesNewestFirst = <T extends DatedEntry>(left: T, right: T): number =>
  getDateTimestamp(right.date) - getDateTimestamp(left.date);

export const getLatestPromiseUpdate = (promise: PartyPromise): PromiseUpdate | undefined =>
  promise.updates?.length ? [...promise.updates].sort(compareDatedEntriesNewestFirst)[0] : undefined;

export const getLatestPromiseUpdateTimestamp = (promise: PartyPromise): number =>
  getDateTimestamp(getLatestPromiseUpdate(promise)?.date);
