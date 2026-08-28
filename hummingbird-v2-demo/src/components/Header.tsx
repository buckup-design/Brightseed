export type TabId = "compounds" | "sources";

const TABS: { id: TabId; label: string }[] = [
  { id: "compounds", label: "Compounds" },
  { id: "sources", label: "Natural Sources" },
];

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  /** No Natural Sources content in this script yet — hide the tab entirely rather than leave it clickable to nothing. */
  hideSourcesTab?: boolean;
}

export default function Header({ activeTab, onTabChange, hideSourcesTab }: HeaderProps) {
  const tabs = hideSourcesTab ? TABS.filter((tab) => tab.id !== "sources") : TABS;
  return (
    <header className="flex items-center gap-1 border-b border-border px-2 pt-3">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-1.5 border-b-2 p-1.5 text-sm font-medium ${
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </header>
  );
}
