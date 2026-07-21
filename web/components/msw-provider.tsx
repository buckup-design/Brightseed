"use client";

import * as React from "react";

/**
 * Starts the MSW browser worker before rendering children, so `next dev`
 * prototype routes fetch through the same mock backend Storybook uses.
 *
 * Dev-only: production builds never start the worker (and `mocks/` is meant to
 * be deleted when a real backend lands). The worker module is dynamically
 * imported inside the effect so `setupWorker` never runs during server render.
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  // In production, render immediately (no mocking). In dev, hold children until
  // the worker is intercepting so the first fetch can't slip past it.
  const [ready, setReady] = React.useState(
    process.env.NODE_ENV === "production",
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let active = true;
    import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
      .then(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
