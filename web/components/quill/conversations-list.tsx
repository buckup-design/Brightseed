"use client";

/**
 * ConversationsList — the Conversations surface ("Conversations list view").
 *
 * The history of chat threads with Hummingbird; each row opens its Workspace
 * (the chat + results canvas). Mirrors the live product's Conversations list
 * (brightseed.ai v1.3.2). A Block — it composes PageHeading + Input + Card +
 * DropdownMenu + Button — and is the content behind App Shell Quill's
 * "Conversations" tab, imported there so the screen and the standalone Block
 * never drift.
 *
 * Conversations sits ALONGSIDE Projects, not instead of it (Becky, July 18
 * 2026): Conversations is the flat thread list (live parity, and the door into
 * a Workspace), Projects the container evolution that groups chats and reports.
 *
 * The whole card opens the conversation (onOpen); a ⋮ overflow carries Rename
 * and Delete. Search filters by title or preview. With zero conversations the
 * list is replaced by an empty state that routes to New chat. Open, Rename,
 * Delete and New chat are callbacks the app owns.
 */

import * as React from "react";
import {
  MessageSquare,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";

export type Conversation = {
  id: string;
  title: string;
  /** A one-line preview of the thread — its opening prompt or last reply. */
  preview: string;
  /** Human-readable relative time, e.g. "2 hours ago". */
  updated: string;
};

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Berberine and glucose metabolism",
    preview:
      "Explored AMPK activation and insulin-sensitivity pathways for a GLP-1 adjacent concept.",
    updated: "2 hours ago",
  },
  {
    id: "c2",
    title: "Resveratrol longevity mechanisms",
    preview: "Discussed sirtuin activation and caloric-restriction mimetics.",
    updated: "Yesterday",
  },
  {
    id: "c3",
    title: "Sulforaphane for gut health",
    preview: "Compared Nrf2 induction across cruciferous sources.",
    updated: "3 days ago",
  },
  {
    id: "c4",
    title: "Quercetin + fisetin synergy",
    preview: "Senolytic stacking and dosing considerations.",
    updated: "1 week ago",
  },
];

export function ConversationsList({
  conversations = SAMPLE_CONVERSATIONS,
  onNewChat,
  onOpen,
  onRename,
  onDelete,
}: {
  conversations?: Conversation[];
  onNewChat?: () => void;
  /** Fired when a conversation is opened — the app routes to its Workspace. */
  onOpen?: (conversation: Conversation) => void;
  onRename?: (conversation: Conversation) => void;
  onDelete?: (conversation: Conversation) => void;
}) {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? conversations.filter((conversation) =>
        `${conversation.title} ${conversation.preview}`
          .toLowerCase()
          .includes(needle)
      )
    : conversations;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeading
          size="sm"
          title="Conversations"
          description="Your chat threads with Hummingbird."
        />
        <Button onClick={onNewChat}>
          <Plus />
          New chat
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[var(--c-conversations-list-shape-radius-md)] border border-dashed border-[var(--c-conversations-list-border-default)] py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--c-conversations-list-surface-alt)] text-[var(--c-conversations-list-text-subtle)]">
            <MessageSquare className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-[var(--c-conversations-list-text-default)]">
              No conversations yet
            </p>
            <p className="max-w-sm text-sm text-[var(--c-conversations-list-text-subtle)]">
              Start a new chat with the Hummingbird agent and your threads will
              collect here.
            </p>
          </div>
          <Button onClick={onNewChat}>
            <Plus />
            New chat
          </Button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--c-conversations-list-text-subtle)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations…"
              className="pl-9"
            />
          </div>

          {visible.length > 0 ? (
            <div className="flex flex-col gap-3">
              {visible.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="relative flex-row items-center gap-4 p-4 transition-colors hover:border-[var(--c-conversations-list-border-hover)]"
                >
                  {/* Whole card opens the conversation. An invisible, keyboard-
                      focusable button fills the card; non-interactive content is
                      pointer-events-none so clicks fall through to it, and the
                      overflow sits above it (later in DOM, relative) — so it
                      stays clickable without nesting interactives. Same pattern
                      as the Reports list. */}
                  <button
                    type="button"
                    aria-label={`Open ${conversation.title}`}
                    onClick={() => onOpen?.(conversation)}
                    className="absolute inset-0 rounded-[var(--c-conversations-list-shape-radius-xl)] outline-none focus-visible:ring-[2px] focus-visible:ring-[var(--c-conversations-list-border-focus)]"
                  />
                  <div className="pointer-events-none flex size-9 shrink-0 items-center justify-center rounded-[var(--c-conversations-list-shape-radius-md)] bg-[var(--c-conversations-list-surface-raised-alt)] text-[var(--c-conversations-list-text-subtle)]">
                    <MessageSquare className="size-5" />
                  </div>
                  <div className="pointer-events-none min-w-0 flex-1 space-y-0.5">
                    <div className="truncate font-medium text-[var(--c-conversations-list-text-default)]">
                      {conversation.title}
                    </div>
                    <div className="truncate text-sm text-[var(--c-conversations-list-text-subtle)]">
                      {conversation.preview}
                    </div>
                  </div>
                  <span className="pointer-events-none hidden shrink-0 text-sm text-[var(--c-conversations-list-text-subtle)] sm:block">
                    {conversation.updated}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="More options"
                        className="relative"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onRename?.(conversation)}>
                        <Pencil />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete?.(conversation)}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--c-conversations-list-text-subtle)]">
              No conversations match your search.
            </p>
          )}
        </>
      )}
    </div>
  );
}
