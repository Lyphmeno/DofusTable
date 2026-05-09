import { LogoutButton } from "@/components/auth/logout-button";
import { AddView } from "@/components/app-shell/add-view";
import { HomeView } from "@/components/app-shell/home-view";
import { TableView } from "@/components/app-shell/table-view";
import { AppNavigation, type AppView } from "@/components/navigation/app-navigation";
import type { Transaction } from "@/lib/types/transaction";

type AppShellProps = {
  transactions?: Transaction[];
  activeView: AppView;
};

const pageTitles: Record<AppView, string> = {
  home: "Accueil",
  add: "Nouvel achat",
  table: "Tableau"
};

export const AppShell = ({ transactions = [], activeView }: AppShellProps) => {
  return (
    <main className="grid h-screen w-full min-w-0 grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[9.5rem_1fr] md:grid-rows-1 lg:grid-cols-[10.5rem_1fr]">
      <AppNavigation activeView={activeView} variant="desktop" />

      <section className="grid h-full min-h-0 min-w-0 grid-rows-[auto_1fr] overflow-hidden p-[0.5rem] md:p-[0.75rem_0.75rem_0.5rem]">
        <header className="mb-[0.25rem] flex items-center justify-between md:mb-[0.5rem]">
          <div>
            <p className="text-[0.75rem] font-medium text-primary md:hidden">Lyphus</p>
            <h1 className="text-[1.125rem] font-semibold tracking-normal md:text-[1.25rem]">
              {pageTitles[activeView]}
            </h1>
          </div>
          <LogoutButton />
        </header>

        <div className="min-h-0 overflow-y-auto overflow-x-hidden">
          {activeView === "home" ? <HomeView /> : activeView === "add" ? <AddView transactions={transactions} /> : <TableView transactions={transactions} />}
        </div>
      </section>

      <AppNavigation activeView={activeView} variant="mobile" />
    </main>
  );
};
