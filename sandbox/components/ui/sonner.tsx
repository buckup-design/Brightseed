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
 *   Toast surface     → --color-surface-default      (white / sand-950)
 *   Toast text        → --color-text-default
 *   Toast border      → --color-border-default
 *   Radius            → --shape-radius-md
 *   Intent surfaces (success/info/warning/error) wired via sonner's
 *   --success-bg / --info-bg / --warning-bg / --error-bg slots, each
 *   pointing to the matching --color-surface-{intent} token. Intent
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
          "--normal-bg": "var(--color-surface-default)",
          "--normal-text": "var(--color-text-default)",
          "--normal-border": "var(--color-border-default)",
          // Intent toasts — semantic surfaces / text / borders
          "--success-bg": "var(--color-surface-success)",
          "--success-text": "var(--color-text-success)",
          "--success-border": "var(--color-border-success-default)",
          "--info-bg": "var(--color-surface-info)",
          "--info-text": "var(--color-text-info)",
          "--info-border": "var(--color-border-info-default)",
          "--warning-bg": "var(--color-surface-warning)",
          "--warning-text": "var(--color-text-warning)",
          "--warning-border": "var(--color-border-warning-default)",
          "--error-bg": "var(--color-surface-critical)",
          "--error-text": "var(--color-text-critical)",
          "--error-border": "var(--color-border-critical-default)",
          // Shape
          "--border-radius": "var(--shape-radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
