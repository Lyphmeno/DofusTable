import Link from "next/link";
import { Home, PlusCircle, Table2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AppView = "home" | "add" | "table";

const navItems: Array<{
  href: string;
  label: string;
  view: AppView;
  icon: LucideIcon;
  section?: string;
}> = [
  {
    href: "/",
    label: "Accueil",
    view: "home",
    icon: Home
  },
  {
    href: "/ajouter",
    label: "Ajouter",
    view: "add",
    icon: PlusCircle,
    section: "Achat/Revente"
  },
  {
    href: "/tableau",
    label: "Tableau",
    view: "table",
    icon: Table2,
    section: "Achat/Revente"
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
        variant === "mobile" && "mx-auto w-full max-w-[min(100%,16rem)] border-t border-border bg-background p-[0.4rem] md:hidden",
        variant === "desktop" && "hidden h-full min-w-0 border-r border-border bg-surface/70 p-[0.75rem] md:flex md:flex-col"
      )}
    >
      {variant === "desktop" ? (
        <div className="mb-[1.25rem]">
          <p className="font-proclamate text-[1.7rem] font-medium text-primary">Lyphus</p>
        </div>
      ) : null}

      <div className={cn(variant === "mobile" && "grid grid-cols-3 gap-[0.4rem]", variant === "desktop" && "space-y-[0.35rem]")}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          const shouldShowSection = variant === "desktop" && item.section && item.section !== navItems[index - 1]?.section;

          return (
            <div className="min-w-0" key={item.view}>
              {shouldShowSection ? (
                <p className="px-[0.35rem] pb-[0.2rem] pt-[0.7rem] text-[0.65rem] font-semibold uppercase tracking-normal text-muted">
                  {item.section}
                </p>
              ) : null}
              <Link
                className={cn(
                  "flex min-w-0 items-center justify-center gap-[0.45rem] rounded-[0.55rem] border p-[0.55rem] text-[0.8125rem] font-medium transition hover:bg-surface-strong",
                  variant === "mobile" && "p-[0.45rem] text-[0.75rem]",
                  variant === "desktop" && "justify-start",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                    : "border-border bg-surface-soft text-muted-foreground"
                )}
                href={item.href}
              >
                <Icon className="shrink-0" size={variant === "mobile" ? "1rem" : "1rem"} />
                <span className={cn("truncate", variant === "mobile" && "sr-only")}>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
