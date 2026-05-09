import { SummaryMetrics } from "@/components/app-shell/summary-metrics";
import { TransactionForm } from "@/components/transactions/transaction-form";
import type { Transaction } from "@/lib/types/transaction";

type AddViewProps = {
  transactions: Transaction[];
};

export const AddView = ({ transactions }: AddViewProps) => {
  return (
    <div className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] content-start gap-[0.4rem] md:h-full md:gap-[0.5rem] md:overflow-hidden">
      <SummaryMetrics transactions={transactions} />

      <section className="min-h-0 md:overflow-hidden">
        <TransactionForm />
      </section>
    </div>
  );
};
