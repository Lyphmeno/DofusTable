import Link from "next/link";
import { Home, PlusCircle, Settings, Table2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AppView = "home" | "add" | "table" | "settings";

type NavItem = {
  href: string;
  label: string;
  view: AppView;
  icon: LucideIcon;
  section?: string;
};

const desktopMainNavItems: NavItem[] = [
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

const desktopFooterNavItems: NavItem[] = [
  {
    href: "/parametres",
    label: "Paramètres",
    view: "settings",
    icon: Settings
  }
];

const mobileNavItems: NavItem[] = [
  {
    href: "/",
    label: "Accueil",
    view: "home",
    icon: Home
  },
  {
    href: "/tableau",
    label: "Achat/Revente",
    view: "table",
    icon: Table2
  },
  {
    href: "/parametres",
    label: "Paramètres",
    view: "settings",
    icon: Settings
  }
];

type AppNavigationProps = {
  activeView: AppView;
  variant: "mobile" | "desktop";
};

export const AppNavigation = ({ activeView, variant }: AppNavigationProps) => {
  const renderNavItems = (navItems: NavItem[]) => {
    return navItems.map((item, index) => {
      const Icon = item.icon;
      const isActive = activeView === item.view || (variant === "mobile" && item.view === "table" && activeView === "add");
      const shouldShowSection = variant === "desktop" && item.section && item.section !== navItems[index - 1]?.section;

      return (
        <div className="min-w-0" key={item.view}>
          {shouldShowSection ? (
            <p className="px-[0.35rem] pb-[0.2rem] pt-[0.7rem] text-[0.65rem] font-semibold uppercase tracking-normal text-muted">
              {item.section}
            </p>
          ) : null}
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-0 items-center justify-center gap-[0.45rem] rounded-[0.55rem] border p-[0.55rem] text-[0.8125rem] font-medium transition hover:bg-surface-strong",
              variant === "mobile" && "flex-col gap-[0.1rem] p-[0.3rem] text-[0.62rem]",
              variant === "desktop" && "justify-start",
              isActive
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                : "border-border bg-surface-soft text-muted-foreground"
            )}
            href={item.href}
          >
            <Icon className="shrink-0" size="1rem" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        </div>
      );
    });
  };

  return (
    <nav
      className={cn(
        variant === "mobile" && "fixed inset-x-0 bottom-0 z-30 mx-auto w-full border-t border-border bg-background/95 p-[0.25rem] md:hidden",
        variant === "desktop" && "hidden h-full min-w-0 border-r border-border bg-surface/70 p-[0.75rem] md:flex md:flex-col"
      )}
    >
      {variant === "desktop" ? (
        <div className="mb-[1.25rem]">
          <p className="font-proclamate text-[1.7rem] font-medium text-primary">Lyphus</p>
        </div>
      ) : null}

      <div className={cn(variant === "mobile" && "mx-auto grid w-full max-w-[min(100%,22rem)] grid-cols-3 gap-[0.3rem]", variant === "desktop" && "space-y-[0.35rem]")}>
        {renderNavItems(variant === "desktop" ? desktopMainNavItems : mobileNavItems)}
      </div>

      {variant === "desktop" ? (
        <div className="mt-auto grid gap-[0.35rem] pt-[0.75rem]">
          {renderNavItems(desktopFooterNavItems)}
        </div>
      ) : null}
    </nav>
  );
};
