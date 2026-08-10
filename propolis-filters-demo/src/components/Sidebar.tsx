import { Plus, MessageSquare, Folder, FileText, Settings } from "lucide-react";

interface SidebarButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
}

function SidebarButton({ icon: Icon, label, active }: SidebarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-accent ${
        active ? "bg-accent text-foreground" : "text-muted-foreground"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-12 flex-col items-center justify-between border-r border-border bg-sidebar py-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-8 items-center justify-center">
          <div className="size-6 rounded-full bg-gradient-to-br from-orange-400 to-rose-500" />
        </div>
        <SidebarButton icon={Plus} label="New" />
        <div className="mt-2 flex flex-col items-center gap-1">
          <SidebarButton icon={MessageSquare} label="Chats" active />
          <SidebarButton icon={Folder} label="Projects" />
          <SidebarButton icon={FileText} label="Documents" />
          <SidebarButton icon={Settings} label="Settings" />
        </div>
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
        CN
      </div>
    </aside>
  );
}
