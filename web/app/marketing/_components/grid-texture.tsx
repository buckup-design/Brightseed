import type { CSSProperties } from "react";

/**
 * Blueprint grid texture — the "texture" line group from the Bold + Restrained
 * Figma frames, reproduced as a CSS line grid instead of ~90 DOM <line>s.
 *
 * Mock spec: ~39px square cells, 1px sage lines (#a7bc87 @ ~45%). `color` and
 * `size` are overridable so Restrained can warm/soften the lines over sand.
 * Absolutely positioned + non-interactive; drop it inside a `relative` parent
 * behind the content.
 */
export function GridTexture({
  className = "",
  color = "rgba(167, 188, 135, 0.4)",
  size = 39,
  style,
}: {
  className?: string;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
    />
  );
}
