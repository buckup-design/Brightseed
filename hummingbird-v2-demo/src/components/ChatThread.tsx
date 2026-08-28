import { useEffect, useRef } from "react";
import hummingbirdLogo from "../assets/hummingbird-logo.svg";
import type { AssistantMessageItem, AssistantTableSegment } from "../data/demoScript";
import type { DemoChatMessage } from "../hooks/useDemoScript";

interface ChatThreadProps {
  messages: DemoChatMessage[];
  /** True while the latest turn's response is still "thinking" — see useDemoScript. */
  isThinking?: boolean;
  /** How many items of the latest turn's response have appeared so far — see useDemoScript. */
  revealedLineCount?: number;
}

function isTableSegment(item: AssistantMessageItem): item is AssistantTableSegment {
  return typeof item !== "string";
}

// Very light plain-text formatting so a scripted response can look like a
// real numbered/bulleted answer without a markdown parser: a line starting
// "1. " renders as a bold heading (a trailing "(...)" parenthetical, if
// any, stays unbolded — it's supporting stats, not part of the heading),
// "- " as a bullet, "  - " as a nested sub-bullet, anything else as a
// plain paragraph. Each line also gets a quick fade/slide-in on mount (see
// .animate-fade-in-up in index.css) — combined with the caller only
// mounting one additional item at a time (see revealedLineCount), this is
// what makes even a one-line response visibly "arrive" instead of a CSS
// delay trick that resolves before anyone notices.
function AssistantLine({ text, animate }: { text: string; animate: boolean }) {
  const animationClass = animate ? "animate-fade-in-up" : "";

  if (/^\d+\.\s/.test(text)) {
    const trailingParenthetical = text.match(/^(.*?)(\s*\([^)]*\))$/);
    if (trailingParenthetical) {
      const [, heading, parenthetical] = trailingParenthetical;
      return (
        <p className={animationClass}>
          <span className="font-semibold">{heading}</span>
          {parenthetical}
        </p>
      );
    }
    return <p className={`${animationClass} font-semibold`}>{text}</p>;
  }
  if (text.startsWith("  - ")) {
    return (
      <p className={`${animationClass} pl-8`}>
        <span className="mr-1.5 text-muted-foreground">◦</span>
        {text.slice(4)}
      </p>
    );
  }
  if (text.startsWith("- ")) {
    return (
      <p className={`${animationClass} pl-4`}>
        <span className="mr-1.5 text-muted-foreground">•</span>
        {text.slice(2)}
      </p>
    );
  }
  return <p className={animationClass}>{text}</p>;
}

// A real HTML table, for the rare response that needs one instead of prose
// — rendered as one whole reveal beat (see AssistantMessageItem), not
// row-by-row. table-fixed + explicit column widths (rather than table-auto)
// so it always fits the chat column's width by wrapping cell text, never by
// scrolling horizontally.
function AssistantTable({ segment, animate }: { segment: AssistantTableSegment; animate: boolean }) {
  const { columns, rows } = segment.table;
  return (
    <div className={`${animate ? "animate-fade-in-up" : ""} rounded-lg border border-border`}>
      <table className="w-full table-fixed border-collapse text-xs">
        {columns.length === 4 && (
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[36%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
          </colgroup>
        )}
        <thead>
          <tr className="border-b border-border bg-muted">
            {columns.map((column) => (
              <th key={column} className="break-words px-2 py-1.5 text-left font-medium text-foreground">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="break-words px-2 py-1.5 align-top text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Renders the accumulated conversation for one chat thread (see
// CHAT_THREAD_BY_SCREEN in demoScript.ts for which screens share a thread).
// Within a turn, the user's message (what triggered this turn) renders
// first, followed by Hummingbird's response. Either half is optional: an
// opening greeting has no userMessage, and a user turn can go unanswered
// for a step (e.g. the response arrives as its own step once the screen
// changes) by omitting assistantMessage.
//
// The very first step of the whole script (isEntryPoint) is present the
// moment the page loads, before any input — it renders fully and
// statically, with no reveal/animation, since it never "just arrived."
// Every other message was revealed by a send: its items (text lines or a
// table) mount one at a time (revealedLineCount, only meaningful for the
// current latest turn) rather than all at once.
export default function ChatThread({ messages, isThinking, revealedLineCount }: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest content in view: a fresh user message (or the next
  // revealed response line/thinking indicator) should always scroll into
  // frame rather than leaving the viewer to notice it appeared off-screen.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isThinking, revealedLineCount]);

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
      {messages.map(({ stepId, turn, isEntryPoint }, index) => {
        const isLast = index === messages.length - 1;
        const showThinking = isLast && !isEntryPoint && isThinking;
        const fullMessage = turn.assistantMessage ?? [];
        const visibleItems =
          isLast && !isEntryPoint ? fullMessage.slice(0, revealedLineCount ?? fullMessage.length) : fullMessage;

        return (
          <div key={stepId} className="flex flex-col gap-2">
            {turn.userMessage && (
              <div className="flex items-center pl-11">
                <div className="flex flex-1 rounded-sm bg-muted p-2">
                  <p className="flex-1 text-sm leading-5 text-foreground">{turn.userMessage}</p>
                </div>
              </div>
            )}

            {showThinking ? (
              <div className="flex items-center gap-[10px]">
                <img src={hummingbirdLogo} alt="" className="size-[28px] shrink-0 animate-pulse" />
              </div>
            ) : (
              visibleItems.length > 0 && (
                <div className="flex items-start gap-[10px]">
                  <img src={hummingbirdLogo} alt="" className="size-[28px] shrink-0" />
                  <div className="flex flex-1 flex-col gap-2 pt-1 text-sm leading-6 text-foreground">
                    {visibleItems.map((item, itemIndex) =>
                      isTableSegment(item) ? (
                        <AssistantTable key={itemIndex} segment={item} animate={!isEntryPoint} />
                      ) : (
                        <AssistantLine key={itemIndex} text={item} animate={!isEntryPoint} />
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
