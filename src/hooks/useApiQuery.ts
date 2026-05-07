import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BackendError } from '../api/client';

export interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * The fetcher receives an AbortSignal and should pass it to axios/fetch.
 * When the component unmounts or refetch is called, the signal aborts,
 * cancelling the in-flight request entirely.
 */
export type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

/**
 * Fetches data and manages loading/error state with full request cancellation.
 *
 * Cancellation happens in two cases:
 *   1. Component unmounts before request completes  →  signal.abort()
 *   2. refetch() is called while a previous request is in flight → previous aborts
 *
 * @param fetcher  Async function that takes an AbortSignal.
 *                 Must be stable across renders (use useCallback if it captures changing values).
 *
 * Example:
 *   const { data, loading, error, refetch } = useApiQuery(
 *     useCallback((signal) => getMyAccounts(signal), [])
 *   );
 */
export function useApiQuery<T>(fetcher: Fetcher<T>): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch((e: unknown) => {
        // Aborted requests throw — distinguish from real errors
        if (axios.isCancel(e) || (e as Error)?.name === 'CanceledError' || controller.signal.aborted) {
          return; // silently ignore aborts
        }
        if (e instanceof BackendError) setError(e.message);
        else if (e instanceof Error)   setError(e.message);
        else                           setError('Unknown error');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    // Cleanup: cancel the in-flight request when:
    //   - component unmounts, or
    //   - refetchCounter changes (refetch was called)
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, refetchCounter]);

  const refetch = useCallback(() => {
    setRefetchCounter((c) => c + 1);
  }, []);

  return { data, loading, error, refetch };
}