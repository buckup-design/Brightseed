"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * CheckYourEmail — the password-reset confirmation screen.
 *
 * The surface a user lands on right after submitting "Forgot your password?"
 * on BrightseedLogin: a centered card with a line-art mail mark, a short
 * confirmation, and a single "Resend email" affordance.
 *
 * Auth family (sits next to BrightseedLogin in components/auth/). Composes the
 * Quill Card + Button; the mail mark is the approved lucide icon (never a
 * hand-rolled glyph), tinted with the forest --ds-color-icon-success green so
 * it reads as brand-confirmation, not a status. A leaf surface, so its own text
 * + icon colours reference --ds-* directly; the Card/Button carry their --c-*.
 *
 * Theme-agnostic: the Card surface, text tokens, and the green all swap under
 * data-theme="dark", so it renders correctly in both themes with no dark code.
 */

export interface CheckYourEmailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The address the reset instructions were sent to (shown in the body copy). */
  email: string;
  /** "Resend email" handler. Inert by default — the app owns what resend does. */
  onResend?: () => void;
}

export function CheckYourEmail({
  email,
  onResend,
  className,
  ...props
}: CheckYourEmailProps) {
  return (
    <Card
      className={cn(
        // p-*/gap-* override the Card's default py-6/gap-6 for a roomier auth
        // card; the base flex-col spaces the three sections (mark, copy, action).
        "w-full max-w-md items-center gap-8 p-10 text-center sm:p-12",
        className,
      )}
      {...props}
    >
      {/* Decorative brand-confirmation mark — the heading carries the meaning,
          so the whole circle is aria-hidden. Circle + envelope share the one
          forest-green token so they read as a single line-art object. */}
      <span
        aria-hidden="true"
        className="flex size-24 items-center justify-center rounded-full border-2 border-[var(--ds-color-icon-success)] text-[var(--ds-color-icon-success)]"
      >
        <Mail className="size-10" strokeWidth={1.5} />
      </span>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium text-[var(--ds-color-text-default)]">
          Check Your Email
        </h1>
        <p className="text-base leading-relaxed text-balance text-[var(--ds-color-text-subtle)]">
          Please check the email address{" "}
          <span className="break-words">{email}</span> for instructions to reset
          your password.
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onResend}
        className="mt-2 h-12 w-full text-base"
      >
        Resend email
      </Button>
    </Card>
  );
}
