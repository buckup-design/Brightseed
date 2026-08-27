import { useState } from "react";

interface ChatComposerProps {
  /** Called on submit — advances the script. Whatever was typed is ignored. */
  onSubmit: () => void;
}

// Looks and feels like a live chat input, but "sending" never reads what
// was typed — it just advances to the next scripted step and clears
// itself. Enter sends (Shift+Enter for a newline), matching normal chat
// composer conventions.
export default function ChatComposer({ onSubmit }: ChatComposerProps) {
  const [message, setMessage] = useState("");

  const send = () => {
    setMessage("");
    onSubmit();
  };

  return (
    <div className="flex w-full flex-col gap-1 px-2 pb-2">
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
        placeholder="Ask Hummingbird"
        rows={2}
        className="min-h-16 w-full resize-none rounded-lg border border-input bg-white px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
      />
      <p className="text-xs text-muted-foreground">Hummingbird can make mistakes. Check important information.</p>
    </div>
  );
}
