"use client";

/**
 * SettingsModal — the large settings surface behind "Settings" in the sidebar
 * footer menu.
 *
 * Per Anna's sketches (Collab Playground 89:1597 Profile, 89:1693 Account),
 * which are patterned on Claude's own settings modal (86:1539, 89:1548): a
 * search-topped left rail of grouped sections, a wide content pane, X to close.
 *
 * This replaces the full-page settings in live Hummingbird v1.3.2 (87:1540),
 * where Profile and Account were stacked cards on a scrolling page. Same
 * content, addressable instead of scrolled.
 *
 * The sketches carry the annotation "treat as a hand drawing, intent only.
 * spacing, colors and radius are not intentional" — so the IA and the field
 * rules below come from the sketch, the measurements come from the DS.
 *
 * The two Placeholder groups are deliberately kept: they are in the sketch, and
 * they are what tells a reviewer the rail is meant to grow. They render as
 * disabled rows rather than being invented into real sections.
 */

import * as React from "react";
import { Shield, SquareUser } from "lucide-react";

import {
  Avatar,
  AvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { AvatarPickerDialog } from "@/components/quill/avatar-picker-dialog";
import { MailCheck, SearchIcon } from "lucide-react";

/** Annotated on the Full name field: "20 character limit. no additional field
 * validation. accepts special characters. display only, not. unique
 * idenitifer." So: maxLength only. No pattern, no trim, no uniqueness check. */
const FULL_NAME_MAX_LENGTH = 20;

export type SettingsUser = {
  name: string;
  email: string;
  emailVerified: boolean;
  memberSince: string;
  color: AvatarColor;
  icon: AvatarIcon;
};

export type SettingsAccount = {
  organization: string;
  healthAreas: string;
  licenseExpires: string;
  teams: string[];
};

export type SettingsSectionId = "profile" | "account";
type SectionId = SettingsSectionId;

/* ── Row primitives ──────────────────────────────────────────────────────
 * Every pane row is label-left / value-right, so the shape lives here once. */

function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-[var(--c-settings-text-default)]">
          {label}
        </span>
        {hint && (
          <span className="text-xs text-[var(--c-settings-text-subtle)]">
            {hint}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

function SettingsRowGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="divide-y divide-[var(--c-settings-border-default)] border-b border-[var(--c-settings-border-default)] last:border-b-0">
      {children}
    </div>
  );
}

function PaneHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-lg text-[var(--c-settings-text-default)]">
      {children}
    </h2>
  );
}

/* ── Rail ────────────────────────────────────────────────────────────────
 * Selected uses the same lime-50 + forest-800 pair as the app sidebar's
 * selected nav item, so "where am I" reads identically in both navs. */

const railItemClasses = cn(
  "flex w-full items-center gap-2 rounded-[var(--c-settings-shape-radius-md)] px-2 py-2 text-left text-sm",
  "text-[var(--c-settings-text-default)]",
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-settings-border-focus)]",
  "hover:bg-[var(--c-settings-surface-alt)]",
  "data-[active=true]:bg-[var(--c-settings-surface-selected-brand)] data-[active=true]:font-medium data-[active=true]:text-[var(--c-settings-text-brand)]",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&>svg]:size-4 [&>svg]:shrink-0"
);

function RailGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-4 pb-1 text-xs text-[var(--c-settings-text-subtle)]">
      {children}
    </div>
  );
}

export function SettingsModal({
  open,
  onOpenChange,
  user,
  account,
  onUserChange,
  openTo = "profile",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SettingsUser;
  account: SettingsAccount;
  /** Called on every edit — the name field and the avatar picker both route
   * here. Persistence is the caller's problem; this component holds no store. */
  onUserChange?: (next: SettingsUser) => void;
  /** Which section to land on. Read on each open, not just on mount, so a
   * caller can raise the modal straight to Account. */
  openTo?: SectionId;
}) {
  const [section, setSection] = React.useState<SectionId>(openTo);
  const [query, setQuery] = React.useState("");
  const [pickerOpen, setPickerOpen] = React.useState(false);

  /* Re-seed per open. Without this the modal would reopen wherever the user
   * last left it, and openTo would only ever apply once. Adjusted during render
   * rather than in an effect — see the note in avatar-picker-dialog. */
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSection(openTo);
      setQuery("");
    }
  }

  const SECTIONS: { id: SectionId; label: string; icon: typeof Shield }[] = [
    { id: "profile", label: "Profile", icon: SquareUser },
    { id: "account", label: "Account", icon: Shield },
  ];

  const q = query.trim().toLowerCase();
  const visible = SECTIONS.filter((s) => s.label.toLowerCase().includes(q));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[56rem] gap-0 overflow-hidden p-0 sm:max-w-[56rem]"
        style={{ height: "min(36rem, 90vh)" }}
      >
        {/* The sketch gives the modal no visible title — the pane heading does
         * that job. Both still have to exist for Radix, so they are here and
         * screen-reader only. */}
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Your profile and account settings.
        </DialogDescription>

        <div className="flex h-full">
          <nav
            aria-label="Settings sections"
            className="flex w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[var(--c-settings-border-default)] bg-[var(--c-settings-surface-alt)] p-3"
          >
            {/* Annotated: "ignore this styling. use DS defaults, and add the
             * search icon". */}
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search settings"
              />
            </InputGroup>

            {visible.length > 0 && <RailGroupLabel>Settings</RailGroupLabel>}
            {visible.map((s) => (
              <button
                key={s.id}
                type="button"
                data-active={section === s.id}
                onClick={() => setSection(s.id)}
                className={railItemClasses}
              >
                <s.icon />
                {s.label}
              </button>
            ))}

            {/* Not yet real sections. Disabled so nobody clicks into a dead
             * pane, but present because the sketch says the rail grows here. */}
            {q === "" &&
              [1, 2].map((group) => (
                <React.Fragment key={group}>
                  <RailGroupLabel>Placeholder {group}</RailGroupLabel>
                  {Array.from({ length: group === 1 ? 3 : 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled
                      className={railItemClasses}
                    >
                      <SquareUser />
                      Placeholder
                    </button>
                  ))}
                </React.Fragment>
              ))}
          </nav>

          <div className="flex-1 overflow-y-auto bg-[var(--c-settings-surface-default)] p-6">
            {section === "profile" && (
              <>
                <PaneHeading>Profile</PaneHeading>
                <SettingsRowGroup>
                  <SettingsRow label="Avatar">
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      aria-label="Change avatar"
                      className="rounded-[var(--c-settings-shape-radius-md)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-settings-border-focus)]"
                    >
                      <Avatar size="lg" className="rounded-lg">
                        <AvatarIdentity
                          color={user.color}
                          icon={user.icon}
                          className="rounded-lg"
                        />
                      </Avatar>
                    </button>
                  </SettingsRow>
                </SettingsRowGroup>

                <SettingsRowGroup>
                  <SettingsRow label="Full name">
                    <Input
                      value={user.name}
                      maxLength={FULL_NAME_MAX_LENGTH}
                      aria-label="Full name"
                      className="w-56"
                      onChange={(e) =>
                        onUserChange?.({ ...user, name: e.target.value })
                      }
                    />
                  </SettingsRow>
                  <SettingsRow label="Email" hint={user.email}>
                    {user.emailVerified && (
                      <Tag variant="outline" iconLeading={<MailCheck />}>
                        Verified
                      </Tag>
                    )}
                  </SettingsRow>
                </SettingsRowGroup>

                <SettingsRowGroup>
                  <SettingsRow label="Member since">
                    <span className="text-sm text-[var(--c-settings-text-default)]">
                      {user.memberSince}
                    </span>
                  </SettingsRow>
                </SettingsRowGroup>
              </>
            )}

            {section === "account" && (
              <>
                <PaneHeading>Account</PaneHeading>
                <SettingsRowGroup>
                  <SettingsRow label="Organization">
                    <span className="text-sm font-medium text-[var(--c-settings-text-default)]">
                      {account.organization}
                    </span>
                  </SettingsRow>
                </SettingsRowGroup>

                <SettingsRowGroup>
                  <SettingsRow label="Health areas">
                    <span className="text-sm font-medium text-[var(--c-settings-text-default)]">
                      {account.healthAreas}
                    </span>
                  </SettingsRow>
                  <SettingsRow label="License expires">
                    <span className="text-sm text-[var(--c-settings-text-default)]">
                      {account.licenseExpires}
                    </span>
                  </SettingsRow>
                </SettingsRowGroup>

                <SettingsRowGroup>
                  <SettingsRow label="Teams">
                    <div className="flex flex-col items-end gap-1">
                      {account.teams.map((t) => (
                        <span
                          key={t}
                          className="text-sm font-medium text-[var(--c-settings-text-default)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </SettingsRow>
                </SettingsRowGroup>
              </>
            )}
          </div>
        </div>
      </DialogContent>

      <AvatarPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        color={user.color}
        icon={user.icon}
        onSave={(next) => onUserChange?.({ ...user, ...next })}
      />
    </Dialog>
  );
}
