/**
 * Brand-graphic panel — the lime line-art hummingbird/botanical graphic
 * (public/brand/graphic_login.bg.webp) with the signature Tiempos "6x faster"
 * overlay, lifted from the BrightseedLogin ImageSlot (components/auth).
 *
 * The graphic is always a light surface, so the panel pins data-theme="light"
 * and its text tokens resolve to light-mode values in both app themes. Overlay
 * type is authored in cqw against the panel width (100cqw), reproducing the
 * Figma proportions at any size — same recipe as the login pane.
 */
export function BrandGraphicPanel({ className }: { className?: string }) {
  return (
    <div
      data-theme="light"
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        backgroundImage: "url('/brand/graphic_login.bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        containerType: "inline-size",
      }}
    >
      <div className="flex h-full min-h-[26rem] flex-col justify-center gap-[3cqw] p-[9cqw]">
        {/* Geist Mono uppercase label */}
        <p
          className="whitespace-pre-wrap uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "4.4cqw",
            lineHeight: "5cqw",
            color: "var(--ds-color-surface-brand-active)",
          }}
        >
          {"Discover \nnutraceuticals"}
        </p>

        {/* Mixed-size Tiempos Fine italic headline */}
        <p
          className="text-[0px]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--ds-color-text-default)",
          }}
        >
          <span style={{ fontSize: "17cqw", lineHeight: "7cqw" }}>6x</span>
          <span style={{ fontSize: "14cqw", lineHeight: "7cqw" }}> faster</span>
        </p>

        {/* Geist body subtext */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "3.4cqw",
            lineHeight: "5cqw",
            color: "var(--ds-color-surface-brand-active)",
          }}
        >
          than the industry average.
        </p>
      </div>
    </div>
  );
}
