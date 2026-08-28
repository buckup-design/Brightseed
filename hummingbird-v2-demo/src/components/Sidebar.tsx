import { Plus, Folder, Bell, Settings } from "lucide-react";
import brightseedLogo from "../assets/brightseed-logo.png";

interface SidebarButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// Matches Figma node 136:92197 ("Sidebar 07."): a flat list of 4 icon
// buttons (no current-page highlight state in that design), rounded-md per
// the SidebarMenuButton spec.
function SidebarButton({ icon: Icon, label }: SidebarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
    >
      <Icon size={16} />
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-12 flex-col items-center justify-between border-r border-border bg-sidebar py-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
          <img src={brightseedLogo} alt="Brightseed" className="size-4" />
        </div>
        <SidebarButton icon={Plus} label="New" />
        <SidebarButton icon={Folder} label="Projects" />
        <SidebarButton icon={Bell} label="Notifications" />
        <SidebarButton icon={Settings} label="Settings" />
      </div>
      <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-medium text-foreground">
        CN
      </div>
    </aside>
  );
}
