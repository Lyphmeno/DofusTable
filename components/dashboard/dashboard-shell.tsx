import { LogoutButton } from "@/components/auth/logout-button";
import { AddView } from "@/components/dashboard/add-view";
import { TableView } from "@/components/dashboard/table-view";
import { AppNavigation, type AppView } from "@/components/navigation/app-navigation";
import type { Transaction } from "@/lib/types/transaction";

type DashboardShellProps = {
  transactions: Transaction[];
  activeView: AppView;
};

export const DashboardShell = ({ transactions, activeView }: DashboardShellProps) => {
  return (
    <main className="grid h-dvh w-full grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[13rem_1fr] md:grid-rows-1">
      <AppNavigation activeView={activeView} variant="desktop" />

      <section className="grid min-h-0 grid-rows-[auto_1fr] overflow-hidden px-3 py-3 md:px-6 md:py-4">
        <header className="mb-3 flex items-center justify-between md:mb-4">
          <div>
            <p className="text-sm font-medium text-kamas md:hidden">DofusTable</p>
            <h1 className="mt-1 text-xl font-semibold tracking-normal md:text-2xl">
              {activeView === "add" ? "Dashboard" : "Tableau"}
            </h1>
          </div>
          <LogoutButton />
        </header>

        <div className="min-h-0 overflow-hidden">
          {activeView === "add" ? <AddView transactions={transactions} /> : <TableView transactions={transactions} />}
        </div>
      </section>

      <AppNavigation activeView={activeView} variant="mobile" />
    </main>
  );
};
