"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group relative flex w-px items-center justify-center",
        "bg-[var(--c-resizable-border-default)]",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:ring-[2px] focus-visible:ring-[var(--c-resizable-border-focus)]",
        "focus-visible:outline-hidden",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        // A clean pill, no grip dots or bordered box. Sits centered on the
        // hairline; the whole handle strip is the `group`, so the pill picks up
        // its hover/drag color from a hover anywhere on the handle, not just on
        // the 6px pill itself.
        <div
          className={cn(
            // shrink-0 is load-bearing: the pill is a flex child of the 1px-wide
            // separator, so without it flex-shrink collapses the 6px width down
            // to 1px (the old grip box only escaped this because its icon gave it
            // intrinsic width).
            "z-10 h-10 w-1.5 shrink-0 rounded-full",
            "bg-[var(--c-resizable-grip-default)]",
            "transition-colors group-hover:bg-[var(--c-resizable-grip-hover)]"
          )}
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
