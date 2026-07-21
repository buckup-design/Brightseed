"use client";

import * as React from "react";

export type Resource<T> = {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  /** Re-run the fetcher (e.g. an error-state "Try again"). */
  reload: () => void;
};

/**
 * Minimal async-fetch hook for prototype surfaces. Runs `fetcher` on mount and
 * whenever `deps` change, tracking { data, error, loading }. No caching, no
 * dedupe, no mutations — deliberately tiny (rule 5: speed of prototyping over
 * infrastructure). Swap for TanStack Query if a real app ever needs more.
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): Resource<T> {
  const [data, setData] = React.useState<T>();
  const [error, setError] = React.useState<Error>();
  const [loading, setLoading] = React.useState(true);
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    fetcher()
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `fetcher` is intentionally excluded — callers pass an inline closure, and
    // `deps` is the explicit dependency contract. `nonce` drives reload().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = React.useCallback(() => setNonce((n) => n + 1), []);

  return { data, error, loading, reload };
}
