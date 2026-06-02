"use client";

import * as React from "react";
import {
  ArrowLeft,
  BookmarkPlus,
  ChevronDown,
  History,
  LayoutGrid,
  List,
  MessageSquare,
  Search,
  Send,
  Settings2,
  SlidersHorizontal,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { PlantCard } from "@/components/forager/cards/plant-card";

/**
 * PlantsView — Forager plants result surface.
 *
 * Reference mock: anna's mocks 4-29-26/filtered to plants.png
 *
 * Composition:
 *   - Icon rail sidebar (left)             ← BrightseedLogo + tool icons
 *   - Chat panel placeholder (middle-left) ← visual scaffold only; the real
 *     component will be styled separately once Becky audits the live one
 *   - Main content (right)                 ← back link + page title +
 *     filter bar + PlantCard grid
 *
 * Forager nav items are placeholders pending real product nav from Becky.
 */

const navItems = [
  { icon: MessageSquare, label: "Conversations" },
  { icon: BookmarkPlus, label: "Saved" },
  { icon: History, label: "History" },
  { icon: Search, label: "Search" },
  { icon: Settings2, label: "Settings" },
];

export function PlantsView() {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="none" className="w-12 border-r">
        <SidebarHeader className="items-center px-1 py-3">
          <BrightseedLogo variant="mark" className="h-7 w-7" />
        </SidebarHeader>
        <SidebarContent className="px-0">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  className="justify-center px-0"
                >
                  <item.icon className="size-4 shrink-0" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="items-center pb-3">
          <div className="size-7 rounded-full bg-[var(--ds-color-surface-tag-orchid)] text-[var(--ds-color-text-tag-orchid)] flex items-center justify-center text-xs font-semibold">
            BB
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-screen">
          {/* Chat panel placeholder */}
          <ChatPanelPlaceholder />

          {/* Main content */}
          <div className="flex-1 flex flex-col bg-[var(--ds-color-surface-alt)] overflow-hidden">
            <PlantsViewHeader />
            <PlantsViewBody />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Chat panel (placeholder)
 * ───────────────────────────────────────────────────────────────────────── */

function ChatPanelPlaceholder() {
  return (
    <aside className="w-80 flex flex-col border-r border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)]">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
          What's interesting here: Trans-anethole from fennel has the lowest IP
          activity of any compound on this list, and one of the cattle studies
          showed a statistically significant increase in milk protein percentage
          (+0.18%). The fennel plant itself is GRAS. There's almost no prior art
          on fennel-derived feed supplements for rumen modulation specifically.
        </p>
        <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
          Would you like to see what fennel-containing or anethole-rich plants
          are in the dataset, and do any also contain secondary compounds that
          could strengthen the rumen microbiome effect?
        </p>

        <div className="self-end">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--ds-color-action-primary)] text-[var(--ds-color-text-on-action-primary)]">
            Yes
          </span>
        </div>

        <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
          <span className="font-medium italic">Foeniculum vulgare</span> +{" "}
          <span className="font-medium italic">Illicium verum</span> together
          covers trans-anethole at high dose plus fenchone, which has separate
          antimethanogenic evidence. No patent we found claims this specific
          combination for ruminant feed application. The combination may be
          patentable as a feed additive composition.
        </p>
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          I've saved this project for you.
        </p>
      </div>

      <div className="p-3 border-t border-[var(--ds-color-border-subtle)] relative">
        <Input
          placeholder="Ask anything..."
          className="pr-9 bg-[var(--ds-color-surface-alt)] border-[var(--ds-color-border-subtle)]"
        />
        <Button
          size="icon-sm"
          variant="ghost"
          className="absolute right-4 top-1/2 -translate-y-1/2"
          aria-label="Send"
        >
          <Send className="size-3.5" />
        </Button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Header (back link + title + filter bar)
 * ───────────────────────────────────────────────────────────────────────── */

function PlantsViewHeader() {
  return (
    <header className="bg-[var(--ds-color-surface-default)] border-b border-[var(--ds-color-border-subtle)] flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <Button
          variant="linktext"
          size="xs"
          className="gap-1 -ml-1 uppercase tracking-wide"
        >
          <ArrowLeft className="size-3" />
          Back to strategies
        </Button>
      </div>
      <div className="px-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-color-text-default)]">
          Shift microbiome towards propionate producers
        </h1>
      </div>

      {/* Filter bar */}
      <div className="px-6 pb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <SourceTab>Compounds</SourceTab>
          <SourceTab active>
            <Sprout className="size-3.5" /> Plant Sources
          </SourceTab>
          <Separator orientation="vertical" className="h-4" />
          <FilterPill label="Evidence" value="Animal" />
          <button className="text-xs font-medium text-[var(--ds-color-text-link-brand)] flex items-center gap-1">
            <SlidersHorizontal className="size-3" />
            Show filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--ds-color-text-subtle)]">
            5 results
          </span>
          <FilterPill label="Sorted by" value="relevance" />
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Grid view"
              className="bg-[var(--ds-color-surface-alt)]"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button size="icon-xs" variant="ghost" aria-label="List view">
              <List className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SourceTab({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={
        active
          ? "inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ds-color-text-default)] border-b-2 border-[var(--ds-color-action-primary)] pb-0.5"
          : "inline-flex items-center gap-1.5 text-sm text-[var(--ds-color-text-subtle)] pb-0.5 hover:text-[var(--ds-color-text-default)]"
      }
    >
      {children}
    </button>
  );
}

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <button className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ds-color-text-default)] px-2 py-1 rounded-md border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] hover:bg-[var(--ds-color-surface-default-hover)]">
      <span className="text-[var(--ds-color-text-subtle)]">{label}:</span>
      {value}
      <ChevronDown className="size-3 text-[var(--ds-color-text-subtle)]" />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Body — Plant card grid
 * ───────────────────────────────────────────────────────────────────────── */

function PlantsViewBody() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlantCard
          scientificName="Foeniculum vulgare"
          commonName="Fennel"
          strategyOneLiner="Shifts rumen microbiome towards propionate producers."
          evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Fenchone, Limonene and Estragole reduce production of methane."
          compounds={["Transanethole", "Fenchone"]}
          compoundOverflow={2}
          bioactives={["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"]}
          bioactiveOverflow={12}
        />
        <PlantCard
          scientificName="Illicium verum"
          commonName="Star Anise"
          strategyOneLiner="Shifts rumen microbiome towards propionate producers."
          evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Estragole and alpha-pinene together reduce gram-positive bacteria."
          compounds={["Transanethole", "Estragole", "Alpha-pinene"]}
          bioactives={["MLCK", "HIF-1α", "Akt", "ZO-1"]}
          bioactiveOverflow={5}
        />
        <PlantCard
          scientificName="Pimpinella anisum"
          commonName="Anise"
          strategyOneLiner="Shifts rumen microbiome towards propionate producers."
          evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Pseudoisoeugenol is predicted to support shift in pH."
          compounds={["Transanethole", "Pseudoisoeugenol", "Anisaldehyde"]}
          bioactives={["MLCK", "HIF-1α", "Akt", "ZO-1", "MUC2"]}
          bioactiveOverflow={12}
        />
        <PlantCard
          scientificName="Coriandrum sativum"
          commonName="Coriander"
          strategyOneLiner="Modulates VFA profile via linalool-rich fractions."
          evidence="Linalool and geranyl acetate show modulation of methanogen populations in pilot rumen studies; IP whitespace clear for feed application."
          compounds={["Linalool", "Geranyl acetate", "Camphor"]}
          bioactives={["NF-kB", "Akt", "ZO-1"]}
          bioactiveOverflow={4}
          ipLandscape="clear"
        />
      </div>
    </div>
  );
}
