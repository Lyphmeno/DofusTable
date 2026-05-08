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
        variant === "mobile" && "mx-auto w-full max-w-[min(100%,18rem)] border-t border-border bg-background p-[0.5rem] md:hidden",
        variant === "desktop" && "hidden h-full min-w-0 border-r border-border bg-surface/70 p-[1rem] md:flex md:flex-col"
      )}
    >
      {variant === "desktop" ? (
        <div className="mb-[2rem]">
          <p className="text-[2rem] font-medium text-primary font-proclamate justify-between align-middle">Lyphus</p>
        </div>
      ) : null}

      <div className={cn(variant === "mobile" && "grid grid-cols-2 gap-[0.5rem]", variant === "desktop" && "space-y-[0.5rem]")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <Link
              className={cn(
                "flex items-center justify-center gap-[0.5rem] rounded-[0.65rem] border p-[0.65rem] text-[0.875rem] font-medium",
                variant === "mobile" && "p-[0.5rem] text-[0.75rem]",
                variant === "desktop" && "justify-start",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-soft text-muted-foreground"
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
