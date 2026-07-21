/**
 * MSW browser worker — the client-side interceptor.
 *
 * Started once by `.storybook/preview.ts` (Storybook, the canonical surface) and
 * by `components/msw-provider.tsx` (the `next dev` prototype route). It reads the
 * generated Service Worker script at `public/mockServiceWorker.js` (regenerate
 * with `npx msw init public/ --save` if it goes missing).
 */

import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
