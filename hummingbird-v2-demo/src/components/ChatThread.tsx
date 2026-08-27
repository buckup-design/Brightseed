import hummingbirdLogo from "../assets/hummingbird-logo.svg";
import type { DemoChatMessage } from "../hooks/useDemoScript";

interface ChatThreadProps {
  messages: DemoChatMessage[];
  /** True while the latest turn's response is still "thinking" — see useDemoScript. */
  isThinking?: boolean;
}

// Very light plain-text formatting so a scripted response can look like a
// real numbered/bulleted answer without a markdown parser: a line starting
// "1. " renders as a bold heading, "- " as a bullet, "  - " as a nested
// sub-bullet, anything else as a plain paragraph. Each line fades in with a
// staggered delay (see the .animate-fade-in-up rule in index.css) — since
// React only mounts a line once (matched by its position, not recreated on
// later re-renders), this plays exactly once per line, when it first
// appears, and never replays for already-settled turns.
function AssistantLine({ text, index }: { text: string; index: number }) {
  const style = { animationDelay: `${index * 120}ms` };

  if (/^\d+\.\s/.test(text)) {
    return (
      <p className="animate-fade-in-up font-semibold" style={style}>
        {text}
      </p>
    );
  }
  if (text.startsWith("  - ")) {
    return (
      <p className="animate-fade-in-up pl-8" style={style}>
        <span className="mr-1.5 text-muted-foreground">◦</span>
        {text.slice(4)}
      </p>
    );
  }
  if (text.startsWith("- ")) {
    return (
      <p className="animate-fade-in-up pl-4" style={style}>
        <span className="mr-1.5 text-muted-foreground">•</span>
        {text.slice(2)}
      </p>
    );
  }
  return (
    <p className="animate-fade-in-up" style={style}>
      {text}
    </p>
  );
}

// Renders the accumulated conversation for one chat thread (see
// CHAT_THREAD_BY_SCREEN in demoScript.ts for which screens share a thread).
// Within a turn, the user's message (what triggered this turn) renders
// first, followed by Hummingbird's response. Either half is optional: an
// opening greeting has no userMessage, and a user turn can go unanswered
// for a step (e.g. the response arrives as its own step once the screen
// changes) by omitting assistantMessage.
export default function ChatThread({ messages, isThinking }: ChatThreadProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
      {messages.map(({ stepId, turn }, index) => {
        const isLast = index === messages.length - 1;
        const showThinking = isLast && isThinking;

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
              turn.assistantMessage &&
              turn.assistantMessage.length > 0 && (
                <div className="flex items-start gap-[10px]">
                  <img src={hummingbirdLogo} alt="" className="size-[28px] shrink-0" />
                  <div className="flex flex-1 flex-col gap-2 pt-1 text-sm leading-6 text-foreground">
                    {turn.assistantMessage.map((line, lineIndex) => (
                      <AssistantLine key={lineIndex} text={line} index={lineIndex} />
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
