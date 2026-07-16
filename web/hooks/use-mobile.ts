import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

export function useIsMobile() {
  // Server renders desktop-first, matching the light-first/desktop-first default;
  // the real width is read on the client's first render, before paint.
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
