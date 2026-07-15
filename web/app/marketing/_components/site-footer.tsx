import type { CSSProperties } from "react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialIcon } from "./social-icons";
import { footer } from "../content";

/**
 * Shared marketing footer — identical structure across all three concepts
 * (Get-in-Touch signup · menu columns · social · legal). Only color differs,
 * so it reads its palette from `--mk-*` CSS vars the page sets on its root:
 *
 *   --mk-footer-surface  footer background
 *   --mk-footer-border   dividers + input borders
 *   --mk-text            logo / heading / strong text
 *   --mk-muted           body + links
 *   --mk-brand           menu headings + social glyphs
 *
 * The SUBMIT button is forest-green in every concept (matching the mock), so it
 * overrides the page's CTA tokens locally rather than inheriting the concept
 * accent.
 */
const SUBMIT_THEME = {
  "--c-button-action-primary": "var(--p-color-forest-900)",
  "--c-button-action-primary-hover": "var(--p-color-forest-950)",
  "--c-button-action-primary-active": "var(--p-color-forest-950)",
  "--c-button-text-on-action-primary": "#ffffff",
  "--c-button-text-on-action-primary-hover": "#ffffff",
  "--c-button-text-on-action-primary-active": "#ffffff",
} as CSSProperties;

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--mk-footer-border)] bg-[var(--mk-footer-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Signup */}
          <div>
            <BrightseedLogo variant="lockup" className="h-6 text-[var(--mk-text)]" />
            <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[var(--mk-text)]">
              {footer.signup.heading}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--mk-muted)]">
              {footer.signup.body}
            </p>
            <form className="mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row">
              <Input
                type="email"
                placeholder={footer.signup.emailPlaceholder}
                aria-label={footer.signup.emailPlaceholder}
                className="border-[var(--mk-footer-border)] bg-[var(--mk-footer-surface)]"
              />
              <Input
                type="text"
                placeholder="First Name"
                aria-label="First Name"
                className="border-[var(--mk-footer-border)] bg-[var(--mk-footer-surface)]"
              />
              <Button type="submit" style={SUBMIT_THEME} className="shrink-0 uppercase tracking-wide">
                {footer.signup.submit}
              </Button>
            </form>
            <div className="mt-8 flex gap-4 text-[var(--mk-brand)]">
              {footer.social.map((s) => (
                <a key={s} href="#" aria-label={s} className="transition-opacity hover:opacity-70">
                  <SocialIcon name={s} className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Menus */}
          {footer.menus.map((m) => (
            <div key={m.heading}>
              <div className="text-sm font-semibold text-[var(--mk-brand)]">{m.heading}</div>
              <ul className="mt-4 space-y-3">
                {m.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[var(--mk-muted)] transition-colors hover:text-[var(--mk-text)]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--mk-footer-border)] pt-6 text-xs text-[var(--mk-muted)] sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l}>
                <a href="#" className="transition-colors hover:text-[var(--mk-text)]">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
