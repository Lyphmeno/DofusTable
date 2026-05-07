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
    <main className="grid h-screen w-full min-w-0 grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[minmax(12rem,18rem)_1fr] md:grid-rows-1">
      <AppNavigation activeView={activeView} variant="desktop" />

      <section className="grid h-full min-h-0 min-w-0 grid-rows-[auto_1fr] overflow-hidden p-[0.5rem] md:p-[0.75rem_0.75rem_0.5rem]">
        <header className="mb-[0.25rem] flex items-center justify-between md:mb-[0.5rem]">
          <div>
            <p className="text-[0.75rem] font-medium text-kamas md:hidden">DofusTable</p>
            <h1 className="text-[1.125rem] font-semibold tracking-normal md:text-[1.25rem]">
              {activeView === "add" ? "Dashboard" : "Tableau"}
            </h1>
          </div>
          <LogoutButton />
        </header>

        <div className="min-h-0 overflow-y-auto overflow-x-hidden">
          {activeView === "add" ? <AddView transactions={transactions} /> : <TableView transactions={transactions} />}
        </div>
      </section>

      <AppNavigation activeView={activeView} variant="mobile" />
    </main>
  );
};
