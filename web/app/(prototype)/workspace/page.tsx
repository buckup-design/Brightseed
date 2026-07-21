"use client";

import { MSWProvider } from "@/components/msw-provider";
import { WorkspaceCanvasConnected } from "@/components/hummingbird/workspace/workspace-canvas-connected";

/**
 * /workspace — a `next dev` proof that the connected Workspace renders against
 * the MSW mock backend OUTSIDE Storybook. Not a production surface: Next is the
 * alpha client mock, Storybook is canonical. The `(prototype)` route group
 * scopes the MSW provider here and leaves login / marketing untouched.
 */
export default function WorkspacePage() {
  return (
    <MSWProvider>
      <div className="h-svh w-full">
        <WorkspaceCanvasConnected />
      </div>
    </MSWProvider>
  );
}
