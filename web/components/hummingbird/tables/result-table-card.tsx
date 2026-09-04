import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/hummingbird/document-parts";

/**
 * ResultTableCard — the card a discovery table sits in.
 *
 * Every table in the flow arrives wrapped the same way: an optional eyebrow or
 * title, the table itself running edge to edge, then a references line and, when
 * a value needed a marker, a footnote. Holding that shell here keeps the table
 * engine free of domain vocabulary — DataTable knows nothing about "references"
 * or "relevant papers".
 *
 * This IS the card: never nest another Card inside it.
 *
 * hummingbird/ tier: reads global --ds-* directly, the convention for this
 * directory (see document-parts.tsx). The table inside reads its own
 * --c-data-table-* / --c-table-* tiers.
 */
export function ResultTableCard({
  title,
  eyebrow,
  description,
  references,
  footnote,
  children,
  className,
}: {
  title?: React.ReactNode;
  /** Small uppercase label above the title, e.g. "Best combinations". */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** The "view 6 relevant papers" line. */
  references?: React.ReactNode;
  /** Explains any marker a cell printed, e.g. the "†" pending-GRAS glyph. */
  footnote?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-5", className)}>
      {eyebrow || title || description ? (
        <div className="flex flex-col gap-1 px-5 pb-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {title ? (
            <h3 className="text-base font-semibold text-[var(--ds-color-text-default)]">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="text-sm text-[var(--ds-color-text-subtle)]">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="px-2">{children}</div>

      {references || footnote ? (
        <div className="flex flex-col gap-1 px-5 pt-4">
          {footnote ? (
            <p className="text-xs text-[var(--ds-color-text-subtle)]">{footnote}</p>
          ) : null}
          {references ? (
            <div className="text-sm text-[var(--ds-color-text-subtle)]">
              <Eyebrow as="h4">References</Eyebrow>
              <div className="mt-1">{references}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
