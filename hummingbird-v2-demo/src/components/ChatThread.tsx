import hummingbirdLogo from "../assets/hummingbird-logo.svg";
import type { DemoChatMessage } from "../hooks/useDemoScript";

interface ChatThreadProps {
  messages: DemoChatMessage[];
  /** True while the latest turn's response is still "thinking" — see useDemoScript. */
  isThinking?: boolean;
  /** How many lines of the latest turn's response have appeared so far — see useDemoScript. */
  revealedLineCount?: number;
}

// Very light plain-text formatting so a scripted response can look like a
// real numbered/bulleted answer without a markdown parser: a line starting
// "1. " renders as a bold heading, "- " as a bullet, "  - " as a nested
// sub-bullet, anything else as a plain paragraph. Each line also gets a
// quick fade/slide-in on mount (see .animate-fade-in-up in index.css) —
// combined with the caller only mounting one additional line at a time
// (see revealedLineCount), this is what makes even a one-line response
// visibly "arrive" instead of a CSS delay trick that resolves before
// anyone notices.
function AssistantLine({ text, animate }: { text: string; animate: boolean }) {
  const animationClass = animate ? "animate-fade-in-up" : "";

  if (/^\d+\.\s/.test(text)) {
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
// Every other message was revealed by a send: its lines mount one at a
// time (revealedLineCount, only meaningful for the current latest turn)
// rather than all at once.
export default function ChatThread({ messages, isThinking, revealedLineCount }: ChatThreadProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
      {messages.map(({ stepId, turn, isEntryPoint }, index) => {
        const isLast = index === messages.length - 1;
        const showThinking = isLast && !isEntryPoint && isThinking;
        const fullMessage = turn.assistantMessage ?? [];
        const visibleLines =
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
              visibleLines.length > 0 && (
                <div className="flex items-start gap-[10px]">
                  <img src={hummingbirdLogo} alt="" className="size-[28px] shrink-0" />
                  <div className="flex flex-1 flex-col gap-2 pt-1 text-sm leading-6 text-foreground">
                    {visibleLines.map((line, lineIndex) => (
                      <AssistantLine key={lineIndex} text={line} animate={!isEntryPoint} />
                    ))}
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
