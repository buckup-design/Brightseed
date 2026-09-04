"use client";

/**
 * useChat — message state for a live chat pane, over a swappable Responder.
 *
 * The hook owns the thread and the pending flag; the Responder owns the answers
 * (see lib/chat-responder.ts for why that split exists). Swapping in
 * Brightseed's internal MCP means passing a different `responder` — nothing
 * here or in the pane changes.
 */

import * as React from "react";

import type {
  ChatTurn,
  Responder,
  ResponderRequest,
} from "@/lib/chat-responder";
import type { ChatMessage } from "@/components/hummingbird/data";

/** ChatPanel's union carries card payloads this pane never uses; the seam
 * speaks the smaller ChatTurn. Narrow on the way out. */
function toTurns(messages: ChatMessage[]): ChatTurn[] {
  return messages.flatMap<ChatTurn>((message) =>
    message.role === "user-yes"
      ? [{ role: "user", text: "Yes" }]
      : [{ role: message.role, text: message.text, meta: message.role === "assistant" ? message.meta : undefined }],
  );
}

export function useChat({
  responder,
  initialMessages = [],
  stage,
  projectId,
}: {
  responder: Responder;
  initialMessages?: ChatMessage[];
  stage?: ResponderRequest["stage"];
  projectId?: string;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [pending, setPending] = React.useState(false);

  /* Two turns can be in flight if the user sends again before the first
   * resolves. Only the newest may write, or a slow first reply lands under a
   * fast second one and the thread reads out of order. */
  const latest = React.useRef(0);

  const send = React.useCallback((value: string) => {
    const text = value.trim();
    if (!text) return;

    const ticket = ++latest.current;
    /* Read from the rendered thread, NOT from inside the setMessages updater:
     * an updater does not run synchronously, so the responder below — called
     * before the first await — would have been handed an empty history. The
     * mock ignores history, so this would only have surfaced once a real
     * backend was behind the seam. */
    const history = toTurns(messages);

    setMessages((current) => [...current, { role: "user", text }]);
    setPending(true);

    void (async () => {
      let reply: ChatMessage;
      try {
        const answer = await responder({ input: text, history, stage, projectId });
        reply = { role: "assistant", text: answer.text, meta: answer.meta };
      } catch {
        /* Surfaced in the thread, not thrown: a failed answer is a conversation
         * turn, and a prototype that white-screens on a backend hiccup teaches
         * the wrong thing about the product. */
        reply = {
          role: "assistant",
          text: "Something went wrong reaching the data. Try that again.",
        };
      }
      if (ticket !== latest.current) return;
      setMessages((current) => [...current, reply]);
      setPending(false);
    })();
  }, [messages, responder, stage, projectId]);

  const reset = React.useCallback(() => {
    /* Bump the ticket so a reply already in flight can no longer write into the
     * thread it was started against. */
    latest.current++;
    setMessages(initialMessages);
    setPending(false);
  }, [initialMessages]);

  return { messages, pending, send, reset };
}
