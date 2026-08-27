import { useRef, useState } from "react";

// The same chat/results width-clamping behavior App.tsx already uses for its
// ResizeHandle, extracted so ProjectScreen and StrategyScreen don't each
// re-implement the pointer math. DEFAULT_WIDTH matches the panel's original
// fixed width, so this is a no-op visually until the handle is dragged.
const DEFAULT_WIDTH = 400;
const MIN_LEFT_WIDTH = 280;
const MIN_RIGHT_WIDTH = 480;

export function useResizableSplit() {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (deltaX: number) => {
    setLeftWidth((current) => {
      const containerWidth = containerRef.current?.getBoundingClientRect().width ?? Infinity;
      const maxWidth = Math.max(MIN_LEFT_WIDTH, containerWidth - MIN_RIGHT_WIDTH);
      return Math.min(maxWidth, Math.max(MIN_LEFT_WIDTH, current + deltaX));
    });
  };

  const reset = () => setLeftWidth(DEFAULT_WIDTH);

  return { leftWidth, containerRef, handleResize, reset };
}
