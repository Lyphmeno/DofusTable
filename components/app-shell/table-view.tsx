import { SummaryMetrics } from "@/components/app-shell/summary-metrics";
import { TransactionTable } from "@/components/transactions/table/transaction-table";
import type { Transaction } from "@/lib/types/transaction";

type TableViewProps = {
  transactions: Transaction[];
};

export const TableView = ({ transactions }: TableViewProps) => {
  return (
    <div className="grid min-h-full min-w-0 gap-[0.5rem] md:h-full md:grid-rows-[auto_1fr] md:overflow-hidden">
      <SummaryMetrics transactions={transactions} />

      <section className="min-h-0 min-w-0">
        <TransactionTable transactions={transactions} />
      </section>
    </div>
  );
};
