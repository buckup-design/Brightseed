"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toaster — Brightseed Forager design system.
 *
 * Color tokens (Brightseed semantics):
 *   Toast surface     → --ds-color-surface-default      (white / sand-950)
 *   Toast text        → --ds-color-text-default
 *   Toast border      → --ds-color-border-default
 *   Radius            → --ds-shape-radius-md
 *   Intent surfaces (success/info/warning/error) wired via sonner's
 *   --success-bg / --info-bg / --warning-bg / --error-bg slots, each
 *   pointing to the matching --ds-color-surface-{intent} token. Intent
 *   text/border follow the same pattern.
 *
 * Theme: reads `data-theme` on <html> directly — see useDataTheme below.
 * Single source of truth, no next-themes dependency.
 */

function useDataTheme(): "light" | "dark" {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const root = document.documentElement

    const read = () => {
      const value = root.dataset.theme
      setTheme(value === "dark" ? "dark" : "light")
    }

    read()

    const observer = new MutationObserver(read)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  return theme
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDataTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          // Default toast — neutral surface
          "--normal-bg": "var(--ds-color-surface-default)",
          "--normal-text": "var(--ds-color-text-default)",
          "--normal-border": "var(--ds-color-border-default)",
          // Intent toasts — semantic surfaces / text / borders
          "--success-bg": "var(--ds-color-surface-success)",
          "--success-text": "var(--ds-color-text-success)",
          "--success-border": "var(--ds-color-border-success-default)",
          "--info-bg": "var(--ds-color-surface-info)",
          "--info-text": "var(--ds-color-text-info)",
          "--info-border": "var(--ds-color-border-info-default)",
          "--warning-bg": "var(--ds-color-surface-warning)",
          "--warning-text": "var(--ds-color-text-warning)",
          "--warning-border": "var(--ds-color-border-warning-default)",
          "--error-bg": "var(--ds-color-surface-critical)",
          "--error-text": "var(--ds-color-text-critical)",
          "--error-border": "var(--ds-color-border-critical-default)",
          // Shape
          "--border-radius": "var(--ds-shape-radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
