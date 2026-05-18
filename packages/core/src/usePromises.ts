import { useEffect, useState } from 'react';
import type { PartyPromise } from './types';

interface PromisesState {
  promises: PartyPromise[];
  loading: boolean;
  error: Error | null;
}

const PROMISES_URL = '/data/promises.json';

let inflight: Promise<PartyPromise[]> | null = null;
let cached: PartyPromise[] | null = null;

const loadPromises = async (): Promise<PartyPromise[]> => {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = fetch(PROMISES_URL, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error(`Promises fetch ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const list = Array.isArray(data) ? (data as PartyPromise[]) : [];
      cached = list;
      return list;
    })
    .catch((error) => {
      inflight = null;
      throw error;
    });
  return inflight;
};

export const usePromises = (): PromisesState => {
  const [state, setState] = useState<PromisesState>(() => ({
    promises: cached ?? [],
    loading: cached === null,
    error: null,
  }));

  useEffect(() => {
    if (cached) {
      setState({ promises: cached, loading: false, error: null });
      return;
    }
    let active = true;
    loadPromises()
      .then((promises) => {
        if (!active) return;
        setState({ promises, loading: false, error: null });
      })
      .catch((error) => {
        if (!active) return;
        setState({ promises: [], loading: false, error: error instanceof Error ? error : new Error(String(error)) });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
};
