# MSW for Prototyping Quill / Hummingbird

A step-by-step guide for adding Mock Service Worker (MSW) to the current setup so non-engineers can prototype Hummingbird screens against realistic API data without a backend.

> Scope: tailored to `web/` as it stands today (Next.js 16.2.4, React 19, Storybook 10.3.6 on `@storybook/nextjs-vite`, Tailwind 4, Vite 8). Worker file lives in `web/public`, which Storybook already serves via `staticDirs: ["../public"]`.

---

## 1. What MSW is, in one paragraph

MSW intercepts network requests at the level the browser actually uses, so your code calls `fetch('/api/compounds')` exactly as it would in production and MSW answers with a mocked response. In the browser it does this with a real Service Worker. In Node (tests, server components) it does it by extending the request classes. The big idea is one standalone mocking layer: you write request handlers once and reuse the same mocks across Storybook, the running app, tests, and live demos. You are not patching `fetch` or stubbing axios, so the prototype behaves like the real thing.

Reference: [mswjs.io Introduction](https://mswjs.io/docs/) and [Quick start](https://mswjs.io/docs/quick-start).

## 2. Why it fits this project

Hummingbird is data-dense: tables, charts, canvas UIs fed by the Forager model. To prototype those screens convincingly you need data, and right now that means either hardcoding fixtures into components (throwaway, untestable) or waiting on a real backend. MSW gives a third option that maps directly onto the case-study pipeline (Cowork to preview to merge):

- One set of handlers powers both Storybook stories and full app screens. The same `GET /api/compounds` mock drives a `CompoundTable` story and the `/compounds` page.
- Components stay honest. They keep their real data-fetching code; only the network is faked. When a real endpoint lands, you delete the handler and nothing in the component changes.
- Vercel previews can ship with mocks on, so a Brightseed teammate clicks a preview URL and sees a working, populated screen with no backend wired up.
- It is documentable. "Here is the contract, here is the mock, here is the screen" is exactly the problem-tried-chose narrative a reviewer needs.

## 3. Where to use it (pick based on need)

| Surface | Use it for | Effort | Recommendation |
|---|---|---|---|
| Storybook | Component and block stories with mocked data, multiple states (loading, empty, error, dense) | Low | Do this first |
| Next.js app, client | Full screens that fetch from client components, dev + Vercel preview | Medium | Do this when prototyping whole pages |
| Next.js app, server (RSC / route handlers) | Mocking data fetched in server components | Higher | Only if a prototype actually fetches server-side |

Start with Storybook. It is the lowest-risk, highest-value surface for a design system and needs no app changes.

---

## 4. Shared foundation (do this once)

These three pieces are reused by every surface.

### 4.1 Install

Run on your Mac (per project rule 9, do not trust sandbox installs):

```bash
cd web
npm install --save-dev msw msw-storybook-addon
```

MSW is pure JS, so unlike the rolldown issue it is safe to install. Target MSW v2 (2.12+) and `msw-storybook-addon` v2.x.

> Compatibility note to verify: `msw-storybook-addon` v2.0.7 predates Storybook 10's ESM-only switch and its `peerDependencies` may still list `^9`. The runtime piece you use (`mswLoader`) is framework-agnostic and works at runtime, but `npm install` may print a peer warning or error. If it errors, install with `npm install --save-dev msw-storybook-addon --legacy-peer-deps`. Track [issue #179](https://github.com/mswjs/msw-storybook-addon/issues/179) for an official SB10 release.

### 4.2 Generate the Service Worker file

```bash
cd web
npx msw init public --save
```

This writes `web/public/mockServiceWorker.js`. It is auto-generated, do not edit it. Because Storybook serves `../public`, this one file covers both Storybook and the Next app. Commit it.

### 4.3 Write your handlers (the single source of truth)

Create `web/mocks/handlers.ts`. Handlers are plain functions that match a request and return a response. Group them by Hummingbird domain.

```ts
// web/mocks/handlers.ts
import { http, HttpResponse, delay } from "msw";
import { compounds } from "./fixtures/compounds";
import { plants } from "./fixtures/plants";

export const handlers = [
  // List compounds
  http.get("/api/compounds", async () => {
    await delay(300); // simulate latency so loading states are real
    return HttpResponse.json(compounds);
  }),

  // Single compound by id (path params)
  http.get("/api/compounds/:id", ({ params }) => {
    const match = compounds.find((c) => c.id === params.id);
    if (!match) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(match);
  }),

  // List plants
  http.get("/api/plants", () => HttpResponse.json(plants)),
];
```

Keep the mock data in `web/mocks/fixtures/` as typed objects so stories and pages share them:

```ts
// web/mocks/fixtures/compounds.ts
export interface Compound {
  id: string;
  name: string;
  plant: string;
  bioactivity: number;
  status: "screening" | "validated" | "flagged";
}

export const compounds: Compound[] = [
  { id: "cmp-001", name: "Quercetin",  plant: "Apple",   bioactivity: 0.82, status: "validated" },
  { id: "cmp-002", name: "Luteolin",   plant: "Celery",  bioactivity: 0.64, status: "screening" },
  { id: "cmp-003", name: "Apigenin",   plant: "Parsley", bioactivity: 0.71, status: "flagged"   },
  // add as many rows as you need to make tables look dense and real
];
```

This is the file you will spend most of your time in. Everything below just wires this into a surface.

---

## 5. Part A: Storybook integration

Storybook 10 with the addon uses the **loader** approach (the old `mswDecorator` is gone).

### Step A1: initialize MSW in preview

Edit `web/.storybook/preview.ts`. Add the import and `initialize()` call at the top, and add `mswLoader` to a `loaders` array on the `preview` object.

```ts
// web/.storybook/preview.ts
import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import "../app/globals.css";
import React from "react";

// Start the worker once when Storybook boots.
// 'bypass' lets any unmocked request (fonts, assets) pass through untouched.
initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  parameters: {
    // ...your existing options/controls/backgrounds stay as they are
  },
  globalTypes: {
    // ...your existing theme toolbar stays as it is
  },
  decorators: [
    // ...your existing theme decorator stays as it is
  ],
  loaders: [mswLoader],
};

export default preview;
```

No change to `main.ts` is required. `staticDirs: ["../public"]` is already set, which is what serves `mockServiceWorker.js`.

### Step A2: give a story mocked data

Attach handlers per story (or per component) with `parameters.msw.handlers`. You can reuse the global handlers, override one, or define inline.

```tsx
// web/components/.../CompoundTable.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse, delay } from "msw";
import { handlers } from "../../mocks/handlers";
import { compounds } from "../../mocks/fixtures/compounds";
import { CompoundTable } from "./CompoundTable";

const meta: Meta<typeof CompoundTable> = {
  title: "Blocks/CompoundTable",
  component: CompoundTable,
};
export default meta;

type Story = StoryObj<typeof CompoundTable>;

// Happy path: reuse the shared handlers
export const Default: Story = {
  parameters: { msw: { handlers } },
};

// Empty state: override just this endpoint
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.get("/api/compounds", () => HttpResponse.json([]))],
    },
  },
};

// Loading state: never resolve so the skeleton shows
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/compounds", async () => {
          await delay("infinite");
        }),
      ],
    },
  },
};

// Error state
export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/compounds", () =>
          HttpResponse.json({ message: "Forager unavailable" }, { status: 503 }),
        ),
      ],
    },
  },
};
```

This pattern (one component, four mocked states) is exactly what makes a design-system case study compelling.

### Step A3: verify

```bash
cd web && npm run storybook
```

Open the Default story, open the browser console, and confirm `[MSW] Mocking enabled.`. The table should populate from your fixtures. If you see a 404 for `mockServiceWorker.js`, re-run `npx msw init public --save`.

References: [msw-storybook-addon](https://github.com/mswjs/msw-storybook-addon) and [Storybook: mocking network requests](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests).

---

## 6. Part B: Next.js app integration (client-side)

This lets full pages fetch mocked data in `npm run dev` and in Vercel previews. The Hummingbird surfaces are client-heavy (tables, charts, canvas), so client-side mocking covers most prototyping.

### Step B1: browser worker

```ts
// web/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

### Step B2: a provider that starts the worker

MSW must be running before any component fetches, so gate rendering on it. Dynamic import keeps browser-only code out of the server bundle.

```tsx
// web/app/msw-provider.tsx
"use client";

import { useEffect, useState } from "react";

const MSW_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MSW === "true";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!MSW_ENABLED);

  useEffect(() => {
    if (!MSW_ENABLED) return;
    let active = true;
    import("../mocks/browser").then(async ({ worker }) => {
      await worker.start({ onUnhandledRequest: "bypass" });
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) return null; // or a Quill spinner
  return <>{children}</>;
}
```

### Step B3: wrap the app

```tsx
// web/app/layout.tsx  (wrap children with the provider)
import { MSWProvider } from "./msw-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
```

### Step B4: control it with an env var

The mock layer is off unless `NEXT_PUBLIC_ENABLE_MSW=true`. This keeps production clean and lets you flip previews on.

```bash
# web/.env.local  (local prototyping)
NEXT_PUBLIC_ENABLE_MSW=true
```

Add a convenience script to `web/package.json` if you like:

```jsonc
"scripts": {
  "dev:mock": "NEXT_PUBLIC_ENABLE_MSW=true next dev"
}
```

### Step B5: verify

```bash
cd web && npm run dev:mock
```

Visit a page that fetches `/api/compounds`, open the console, confirm `[MSW] Mocking enabled.`, and check the Network tab shows the request served by the worker.

### Optional: server-side (RSC / route handlers)

Only needed if a prototype fetches in a server component. Add `web/mocks/server.ts` with `setupServer(...handlers)` from `msw/node`, then start it once at the top of `instrumentation.ts` (or `layout.tsx`) guarded by `process.env.NEXT_RUNTIME === "nodejs"` and the same env flag. Note Next.js forces `NODE_ENV=production` after `next build`, so use a custom flag (like `NEXT_PUBLIC_ENABLE_MSW`) rather than `NODE_ENV` to decide. See the worked example at [laststance/next-msw-integration](https://github.com/laststance/next-msw-integration) (Next 16 + MSW 2.12).

---

## 7. Vercel preview deployments

Goal: previews show populated screens, production stays untouched.

1. In Vercel project settings, add an environment variable `NEXT_PUBLIC_ENABLE_MSW` set to `true` and scoped to **Preview** only (not Production).
2. Confirm `web/public/mockServiceWorker.js` is committed so it ships in the build.
3. Production has no flag, so MSW never starts there.

Result: every preview URL from the Cowork to preview to merge pipeline is a working, data-populated prototype, and merging to production does not drag mocks along.

---

## 8. Organizing handlers as the project grows

- One file per domain under `web/mocks/handlers/` (`compounds.ts`, `plants.ts`, `strategies.ts`), re-exported from `web/mocks/handlers.ts`. See [structuring handlers](https://mswjs.io/docs/best-practices/structuring-handlers).
- Keep fixtures typed and in `web/mocks/fixtures/`. Share the same types your components consume so the mock cannot drift from the contract.
- Use `delay()` deliberately to exercise loading states; use status codes to exercise error states.
- For per-story or per-interaction overrides, layer handlers with `parameters.msw.handlers` (Storybook) or `worker.use(...)` (app). See [network behavior overrides](https://mswjs.io/docs/best-practices/network-behavior-overrides).

## 9. Gotchas

- **Worker file 404.** The single most common failure. Fix: `npx msw init public --save`, and confirm Storybook `staticDirs` includes `../public` (it does today).
- **Storybook 10 peer warning.** Expected until the addon ships an SB10 release; the loader works at runtime. Use `--legacy-peer-deps` if install hard-fails.
- **Race condition.** Always `await worker.start()` before rendering data-fetching components. The provider in Step B2 handles this.
- **Relative vs absolute URLs.** Decide early. If components call `/api/...`, handlers must match `/api/...`. If they call `https://api.brightseed.../...`, match the full URL. Mixing them silently breaks interception.
- **React StrictMode double-render** can cause a fetch to resolve after unmount in dev. Guard async setState with an `active`/`isMounted` flag (shown in the provider).
- **Do not leak mocks to production.** Gate on `NEXT_PUBLIC_ENABLE_MSW`, scope the Vercel var to Preview only.

## 10. The command block to hand off

Everything that must run on your Mac, in order:

```bash
cd "web"

# 1. install
npm install --save-dev msw msw-storybook-addon
#    if the addon peer-deps reject SB10:
#    npm install --save-dev msw-storybook-addon --legacy-peer-deps

# 2. generate the service worker into the shared public dir
npx msw init public --save

# 3. (after editing preview.ts and adding handlers/fixtures) run Storybook
npm run storybook

# 4. (after adding the provider + env flag) run the app with mocks on
NEXT_PUBLIC_ENABLE_MSW=true npm run dev
```

Source files to create or edit: `web/mocks/handlers.ts`, `web/mocks/fixtures/*.ts`, `web/mocks/browser.ts`, `web/.storybook/preview.ts`, `web/app/msw-provider.tsx`, `web/app/layout.tsx`, `web/.env.local`. I can scaffold any of these on request.

---

### Sources

- [Mock Service Worker docs (Introduction)](https://mswjs.io/docs/)
- [MSW Quick start](https://mswjs.io/docs/quick-start)
- [MSW Browser integration](https://mswjs.io/docs/integrations/browser/)
- [MSW best practices: structuring handlers](https://mswjs.io/docs/best-practices/structuring-handlers)
- [msw-storybook-addon](https://github.com/mswjs/msw-storybook-addon)
- [Storybook 10 support issue #179](https://github.com/mswjs/msw-storybook-addon/issues/179)
- [Storybook: mocking network requests](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests)
- [laststance/next-msw-integration (Next 16 + MSW 2.12 worked example)](https://github.com/laststance/next-msw-integration)
