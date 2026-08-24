import { useState } from "react";

type ResizeHandleProps = {
  /** Called with the pointer's horizontal movement (px) since the last event. */
  onResize: (deltaX: number) => void;
  /** Restore the default split. Wired to double-click. */
  onReset?: () => void;
};

// Draggable divider between the chat panel and the results panel. Renders a
// hairline that widens/tints on hover or while dragging so the affordance
// reads before the user commits to grabbing it — the hit area (px-1.5,
// ~12px) is intentionally wider than the visible line so it's easy to grab.
export default function ResizeHandle({ onResize, onReset }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Left-button/primary input only, so this doesn't hijack right-click etc.
    if (event.button !== 0) return;
    event.preventDefault();

    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    setIsDragging(true);
    // Dragging fast can otherwise select surrounding text; col-resize cursor
    // stays correct even when the pointer strays off the thin handle itself.
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    let lastX = event.clientX;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - lastX;
      lastX = moveEvent.clientX;
      onResize(deltaX);
    };

    const stopDragging = () => {
      handle.removeEventListener("pointermove", handlePointerMove);
      handle.removeEventListener("pointerup", stopDragging);
      handle.removeEventListener("pointercancel", stopDragging);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      setIsDragging(false);
    };

    handle.addEventListener("pointermove", handlePointerMove);
    handle.addEventListener("pointerup", stopDragging);
    handle.addEventListener("pointercancel", stopDragging);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onPointerDown={handlePointerDown}
      onDoubleClick={onReset}
      className="group relative z-10 w-3 shrink-0 cursor-col-resize touch-none select-none"
    >
      <div
        className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors ${
          isDragging ? "bg-primary" : "bg-border group-hover:bg-primary"
        }`}
      />
    </div>
  );
}
