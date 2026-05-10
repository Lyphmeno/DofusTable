import { AddView } from "@/components/app-shell/add-view";
import { HomeView } from "@/components/app-shell/home-view";
import { SettingsView } from "@/components/app-shell/settings-view";
import { TableView } from "@/components/app-shell/table-view";
import { AppNavigation, type AppView } from "@/components/navigation/app-navigation";
import type { Profile } from "@/lib/types/profile";
import type { Transaction } from "@/lib/types/transaction";

type AppShellProps = {
  transactions?: Transaction[];
  activeView: AppView;
  profile?: Profile | null;
};

const pageTitles: Record<AppView, string> = {
  home: "Accueil",
  add: "Nouvel achat",
  table: "Tableau",
  settings: "Paramètres"
};

const pageCategoryLabels: Partial<Record<AppView, string>> = {
  add: "Achat/Revente",
  table: "Achat/Revente"
};

export const AppShell = ({ transactions = [], activeView, profile = null }: AppShellProps) => {
  const isHome = activeView === "home";
  const isSettings = activeView === "settings";

  return (
    <main className="grid h-screen w-full min-w-0 overflow-hidden md:grid-cols-[9.5rem_1fr] lg:grid-cols-[10.5rem_1fr]">
      <AppNavigation activeView={activeView} variant="desktop" />

      <section className="grid h-full min-h-0 min-w-0 grid-rows-[auto_1fr] overflow-hidden p-[0.3rem_0.3rem_4.2rem] md:p-[0.75rem_0.75rem_0.5rem]">
        <header className="mb-[0.15rem] grid grid-cols-[2rem_1fr_2rem] items-center md:mb-[0.5rem] md:flex md:justify-between">
          <div className="hidden md:block">
            <h1 className="text-[1.25rem] font-semibold tracking-normal">
              {pageTitles[activeView]}
            </h1>
          </div>
          <div className="col-start-2 min-w-0 text-center md:hidden">
            {isHome ? (
              null
            ) : isSettings ? (
              <h1 className="truncate text-[1.25rem] font-bold leading-tight tracking-normal text-foreground">
                {pageTitles[activeView]}
              </h1>
            ) : (
              <>
                <p className="truncate text-[0.68rem] font-semibold text-primary">{pageCategoryLabels[activeView]}</p>
                <h1 className="truncate text-[1.25rem] font-bold leading-tight tracking-normal text-foreground">
                  {pageTitles[activeView]}
                </h1>
              </>
            )}
          </div>
        </header>

        <div className="scrollbar-none min-h-0 overflow-y-auto overflow-x-hidden">
          {activeView === "home" ? (
            <HomeView />
          ) : activeView === "add" ? (
            <AddView transactions={transactions} />
          ) : activeView === "settings" ? (
            <SettingsView profile={profile} />
          ) : (
            <TableView transactions={transactions} />
          )}
        </div>
      </section>

      <AppNavigation activeView={activeView} variant="mobile" />
    </main>
  );
};
