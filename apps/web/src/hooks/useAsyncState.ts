/**
 * useAsyncState hook for YK Buddy
 * Manages async operations with loading, error, and data states
 */

'use client';

import { useCallback, useState } from 'react';

/**
 * State for async operations
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for managing async state (data, loading, error)
 * @param asyncFunction - Async function to execute
 * @returns Async state and execute function
 * @example
 * const { data, loading, error, execute } = useAsyncState(
 *   async (id: string) => fetchGarageSale(id)
 * );
 *
 * // Later:
 * await execute(saleId);
 * if (data) console.log(data);
 */
export function useAsyncState<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
