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
 * Toaster, Brightseed Quill design system.
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
 * Theme: reads `data-theme` on <html> directly, see useDataTheme below.
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
          // Default toast, neutral surface
          "--normal-bg": "var(--ds-sonner-surface-default)",
          "--normal-text": "var(--ds-sonner-text-default)",
          "--normal-border": "var(--ds-sonner-border-default)",
          // Intent toasts, semantic surfaces / text / borders
          "--success-bg": "var(--ds-sonner-surface-success)",
          "--success-text": "var(--ds-sonner-text-success)",
          "--success-border": "var(--ds-sonner-border-success-default)",
          "--info-bg": "var(--ds-sonner-surface-info)",
          "--info-text": "var(--ds-sonner-text-info)",
          "--info-border": "var(--ds-sonner-border-info-default)",
          "--warning-bg": "var(--ds-sonner-surface-warning)",
          "--warning-text": "var(--ds-sonner-text-warning)",
          "--warning-border": "var(--ds-sonner-border-warning-default)",
          "--error-bg": "var(--ds-sonner-surface-critical)",
          "--error-text": "var(--ds-sonner-text-critical)",
          "--error-border": "var(--ds-sonner-border-critical-default)",
          // Shape
          "--border-radius": "var(--ds-sonner-shape-radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
