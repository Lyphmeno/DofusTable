import Link from "next/link";
import { LayoutDashboard, Table2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AppView = "add" | "table";

const navItems: Array<{
  href: string;
  label: string;
  view: AppView;
  icon: typeof LayoutDashboard;
}> = [
  {
    href: "/",
    label: "Dashboard",
    view: "add",
    icon: LayoutDashboard
  },
  {
    href: "/?view=table",
    label: "Tableau",
    view: "table",
    icon: Table2
  }
];

type AppNavigationProps = {
  activeView: AppView;
  variant: "mobile" | "desktop";
};

export const AppNavigation = ({ activeView, variant }: AppNavigationProps) => {
  return (
    <nav
      className={cn(
        variant === "mobile" && "mx-auto grid w-full max-w-xs grid-cols-2 gap-2 border-t border-line bg-ink px-3 py-2 md:hidden",
        variant === "desktop" && "hidden h-dvh border-r border-line bg-panel/70 p-4 md:flex md:flex-col"
      )}
    >
      {variant === "desktop" ? (
        <div className="mb-8">
          <p className="text-sm font-medium text-kamas">DofusTable</p>
          <p className="mt-1 text-xs text-slate-400">Tracker prive</p>
        </div>
      ) : null}

      <div className={cn(variant === "desktop" && "space-y-2")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <Link
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm font-medium",
                variant === "mobile" && "px-2 py-2 text-xs",
                variant === "desktop" && "justify-start",
                isActive
                  ? "border-mint bg-mint text-ink"
                  : "border-line bg-panelSoft text-slate-300"
              )}
              href={item.href}
              key={item.view}
            >
              <Icon size={variant === "mobile" ? "1rem" : "1.125rem"} />
              <span className={variant === "mobile" ? "sr-only" : undefined}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
