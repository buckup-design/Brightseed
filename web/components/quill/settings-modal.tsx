"use client";

/**
 * SettingsModal — the large settings surface behind "Settings" in the sidebar
 * footer menu. A subcomponent of AppShellQuill (Blocks/App Shell Quill).
 *
 * Per the proposal sketches (Collab Playground 89:1597 Profile, 89:1693 Account),
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
 * ── Extension point ──────────────────────────────────────────────────────
 * The rail and the panes are built from ONE config array (`groups`, below).
 * A section is one rail row + one content pane; a group is a rail header with
 * its sections. To add settings the dev team adds a group (or a section to an
 * existing group) — nothing else in this file changes, the rail, search, the
 * scroll region and the pane heading all read from the config. The two
 * "Placeholder" groups are live, navigable examples of exactly that: rename or
 * replace them.
 *
 * The pane is a fixed header over a scrollable body, so the section title
 * stays put and a section can grow past the modal without the rail moving.
 * There isn't enough content to scroll today; the long Placeholder pane
 * demonstrates it deliberately.
 */

import * as React from "react";
import {
  MailCheck,
  Monitor,
  Moon,
  SearchIcon,
  Shield,
  SquareDashed,
  SquareUser,
  Sun,
  type LucideIcon,
} from "lucide-react";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { AvatarPickerDialog } from "@/components/quill/avatar-picker-dialog";

/** Annotated on the Full name field: "20 character limit. no additional field
 * validation. accepts special characters. display only, not. unique
 * idenitifer." So: maxLength only. No pattern, no trim, no uniqueness check. */
const FULL_NAME_MAX_LENGTH = 20;

/** The three appearance choices, live-driven by the caller. "system" defers to
 * the OS preference; the modal never resolves or applies it — that is the app's
 * job (see the story for the reference wiring). */
export type Appearance = "system" | "light" | "dark";

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

/** A section id is a free string, not a closed union: the whole point of the
 * config is that the dev team adds sections. "profile" and "account" are the
 * two known ids callers can open straight to. */
export type SettingsSectionId = string;

/** One rail row + one content pane. */
type SettingsSection = {
  id: SettingsSectionId;
  /** Rail row text. */
  label: string;
  /** Pane heading; defaults to `label` when omitted. */
  title?: string;
  icon: LucideIcon;
  content: React.ReactNode;
};

/** A rail header and the sections under it. */
type SettingsGroup = {
  label: string;
  sections: SettingsSection[];
};

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
    <h2 className="text-lg text-[var(--c-settings-text-default)]">{children}</h2>
  );
}

/* ── Appearance toggle ─────────────────────────────────────────────────────
 * Icon-only segmented control: System (follow the device), Light, Dark. Built
 * on the DS ToggleGroup, so the selected button gets the same brand-subtle
 * surface every toggle uses. Single-select, and it never clears: appearance
 * always has a value, so a click on the active option is ignored. */

const APPEARANCE_OPTIONS: {
  value: Appearance;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function AppearanceToggle({
  value,
  onChange,
}: {
  value: Appearance;
  onChange: (next: Appearance) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(next) => {
        // Radix hands back "" when the active item is re-clicked; ignore it so
        // the control can't land in a no-selection state.
        if (next) onChange(next as Appearance);
      }}
      aria-label="Appearance"
    >
      {APPEARANCE_OPTIONS.map(({ value: v, label, icon: Icon }) => (
        <ToggleGroupItem key={v} value={v} aria-label={label} className="px-2.5">
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/* ── Panes ─────────────────────────────────────────────────────────────────
 * Each returns pane body only — the sticky heading is rendered by the modal
 * from the active section's title, so panes never repeat it. */

function ProfilePane({
  user,
  onUserChange,
  appearance,
  onAppearanceChange,
  onEditAvatar,
}: {
  user: SettingsUser;
  onUserChange?: (next: SettingsUser) => void;
  appearance: Appearance;
  onAppearanceChange: (next: Appearance) => void;
  onEditAvatar: () => void;
}) {
  return (
    <>
      <SettingsRowGroup>
        <SettingsRow label="Avatar">
          <button
            type="button"
            onClick={onEditAvatar}
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
            onChange={(e) => onUserChange?.({ ...user, name: e.target.value })}
          />
        </SettingsRow>
        <SettingsRow label="Email" hint={user.email}>
          {user.emailVerified && (
            <Tag variant="outline" iconLeading={<MailCheck />}>
              Verified
            </Tag>
          )}
        </SettingsRow>
        <SettingsRow label="Appearance">
          <AppearanceToggle value={appearance} onChange={onAppearanceChange} />
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
  );
}

function AccountPane({ account }: { account: SettingsAccount }) {
  return (
    <>
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
  );
}

/** Stand-in pane for a not-yet-built section. `rows` exists only so one example
 * can be made long enough to prove the pane scrolls independently of the rail. */
function PlaceholderPane({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm text-[var(--c-settings-text-subtle)]">
        Placeholder section. Replace it with real settings when the need arises —
        add a group or a section to the <code>groups</code> config in
        settings-modal.tsx and it appears here.
      </p>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-[var(--c-settings-shape-radius-md)] bg-[var(--c-settings-surface-alt)]"
          />
        ))}
      </div>
    </div>
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
  appearance,
  onAppearanceChange,
  openTo = "profile",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SettingsUser;
  account: SettingsAccount;
  /** Called on every edit — the name field and the avatar picker both route
   * here. Persistence is the caller's problem; this component holds no store. */
  onUserChange?: (next: SettingsUser) => void;
  /** Controlled appearance preference. Optional: left uncontrolled, the modal
   * tracks its own selection so the toggle still works standalone, but only the
   * caller can actually apply the theme (see `onAppearanceChange`). */
  appearance?: Appearance;
  /** Fired when the appearance toggle changes. The modal does not touch the
   * theme itself — the app owns persistence and applies it. */
  onAppearanceChange?: (next: Appearance) => void;
  /** Which section to land on. Read on each open, not just on mount, so a
   * caller can raise the modal straight to Account. Falls back to the first
   * section if the id isn't found. */
  openTo?: SettingsSectionId;
}) {
  const [section, setSection] = React.useState<SettingsSectionId>(openTo);
  const [query, setQuery] = React.useState("");
  const [pickerOpen, setPickerOpen] = React.useState(false);

  /* Appearance is controlled when the caller passes it; otherwise the modal
   * keeps its own so the toggle is never dead. */
  const [internalAppearance, setInternalAppearance] =
    React.useState<Appearance>(appearance ?? "system");
  const appearanceValue = appearance ?? internalAppearance;
  const handleAppearanceChange = (next: Appearance) => {
    setInternalAppearance(next);
    onAppearanceChange?.(next);
  };

  /* The one config the rail, search and panes all read from. Adding settings is
   * adding an entry here. */
  const groups: SettingsGroup[] = [
    {
      label: "Settings",
      sections: [
        {
          id: "profile",
          label: "Profile",
          icon: SquareUser,
          content: (
            <ProfilePane
              user={user}
              onUserChange={onUserChange}
              appearance={appearanceValue}
              onAppearanceChange={handleAppearanceChange}
              onEditAvatar={() => setPickerOpen(true)}
            />
          ),
        },
        {
          id: "account",
          label: "Account",
          icon: Shield,
          content: <AccountPane account={account} />,
        },
      ],
    },
    // ── Examples the dev team can rename or replace. Delete these two groups
    //    and add real ones the same way. ──
    {
      label: "Placeholder one",
      sections: [
        {
          id: "placeholder-one",
          label: "Overview",
          title: "Placeholder one",
          icon: SquareDashed,
          content: <PlaceholderPane />,
        },
      ],
    },
    {
      label: "Placeholder two",
      sections: [
        {
          id: "placeholder-two",
          label: "Overview",
          title: "Placeholder two",
          icon: SquareDashed,
          // Long on purpose: this is the pane that proves the content scrolls.
          content: <PlaceholderPane rows={14} />,
        },
      ],
    },
  ];

  const allSections = groups.flatMap((g) => g.sections);

  /* Re-seed per open. Without this the modal would reopen wherever the user
   * last left it, and openTo would only ever apply once. Adjusted during render
   * rather than in an effect — see the note in avatar-picker-dialog. */
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const landing = allSections.some((s) => s.id === openTo)
        ? openTo
        : (allSections[0]?.id ?? openTo);
      setSection(landing);
      setQuery("");
    } else {
      // The avatar picker is a nested dialog gated only on pickerOpen, so if
      // the modal closes while it's open it would orphan (and pop back up on
      // the next open). Close it with the modal.
      setPickerOpen(false);
    }
  }

  const q = query.trim().toLowerCase();
  /* Search filters the rail. A group whose header matches keeps all its
   * sections (so "placeholder" surfaces the whole group); otherwise only the
   * sections whose label matches survive, and empty groups drop out. */
  const filteredGroups = groups
    .map((g) => {
      if (q === "" || g.label.toLowerCase().includes(q)) return g;
      return {
        ...g,
        sections: g.sections.filter((s) => s.label.toLowerCase().includes(q)),
      };
    })
    .filter((g) => g.sections.length > 0);

  const active =
    allSections.find((s) => s.id === section) ?? allSections[0] ?? null;
  const activeTitle = active ? (active.title ?? active.label) : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // grid-rows-[minmax(0,1fr)]: DialogContent is display:grid, and its
        // default content-sized row would let the inner flex chain grow to its
        // content height — so the modal clipped instead of scrolling. Pinning
        // the single in-flow row to the modal height is what makes the pane's
        // overflow-y-auto a real scroll container.
        className="grid-rows-[minmax(0,1fr)] max-w-[56rem] gap-0 overflow-hidden p-0 sm:max-w-[56rem]"
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

            {filteredGroups.length === 0 ? (
              <p className="px-2 pt-4 text-xs text-[var(--c-settings-text-subtle)]">
                No settings match “{query.trim()}”.
              </p>
            ) : (
              filteredGroups.map((g) => (
                <React.Fragment key={g.label}>
                  <RailGroupLabel>{g.label}</RailGroupLabel>
                  {g.sections.map((s) => (
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
                </React.Fragment>
              ))
            )}
          </nav>

          {/* Content pane: a fixed header row over a scrollable body. The
           * header stays put while the body scrolls, and keeping it out of the
           * scroll region means the scrollbar starts BELOW it — clear of the
           * Dialog close button in the top-right corner. */}
          <section
            aria-label={activeTitle}
            className="flex flex-1 flex-col overflow-hidden bg-[var(--c-settings-surface-canvas)]"
          >
            {/* Fixed header — pr-12 reserves the close-button corner. */}
            <div className="shrink-0 px-6 pt-6 pb-3 pr-12">
              <PaneHeading>{activeTitle}</PaneHeading>
            </div>
            {/* Scrollable body. min-h-0 lets this flex child shrink to the modal
             * height so its own overflow-y-auto scrolls. Thin, theme-aware
             * scrollbar (the token swaps under data-theme="dark"). */}
            <div
              className="min-h-0 flex-1 overflow-y-auto px-6 pb-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                  "var(--c-settings-scrollbar-thumb) transparent",
              }}
            >
              {active?.content}
            </div>
          </section>
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
