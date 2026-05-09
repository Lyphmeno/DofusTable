import { SummaryMetrics } from "@/components/app-shell/summary-metrics";
import { TransactionTable } from "@/components/transactions/table/transaction-table";
import type { Transaction } from "@/lib/types/transaction";

type TableViewProps = {
  transactions: Transaction[];
};

export const TableView = ({ transactions }: TableViewProps) => {
  return (
    <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] content-start gap-[0.3rem] md:gap-[0.5rem] md:overflow-hidden">
      <SummaryMetrics transactions={transactions} />

      <section className="min-h-0 min-w-0">
        <TransactionTable transactions={transactions} />
      </section>
    </div>
  );
};
