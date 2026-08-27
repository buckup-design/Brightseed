import hummingbirdLogo from "../assets/hummingbird-logo.svg";
import type { DemoChatMessage } from "../hooks/useDemoScript";

interface ChatThreadProps {
  messages: DemoChatMessage[];
}

// Renders the accumulated conversation for one chat thread (see
// CHAT_THREAD_BY_SCREEN in demoScript.ts for which screens share a thread).
// Within a turn, the user's message (what triggered this turn) renders
// first, followed by Hummingbird's response — turns with no userMessage
// (e.g. an opening greeting) render assistant-only.
export default function ChatThread({ messages }: ChatThreadProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
      {messages.map(({ stepId, turn }) => (
        <div key={stepId} className="flex flex-col gap-2">
          {turn.userMessage && (
            <div className="flex items-center pl-11">
              <div className="flex flex-1 rounded-sm bg-muted p-2">
                <p className="flex-1 text-sm leading-5 text-foreground">{turn.userMessage}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-[10px]">
            <img src={hummingbirdLogo} alt="" className="size-[28px] shrink-0" />
            <div className="flex flex-1 flex-col gap-2 pt-1 text-sm leading-6 text-foreground">
              {turn.assistantMessage.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
