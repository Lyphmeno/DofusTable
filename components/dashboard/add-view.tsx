import { MetricCard } from "@/components/dashboard/metric-card";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { summarizeTransactions } from "@/lib/transactions/calculations";
import type { Transaction } from "@/lib/types/transaction";
import { KamasValue } from "@/components/ui/kamas-value";

type AddViewProps = {
  transactions: Transaction[];
};

export const AddView = ({ transactions }: AddViewProps) => {
  const summary = summarizeTransactions(transactions);

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-3 overflow-hidden md:gap-4">
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="Benefice en attente" value={<KamasValue value={summary.pendingProfit} />} tone="warning" />
        <MetricCard label="Benefice reel" value={<KamasValue value={summary.realizedProfit} />} tone="positive" />
      </section>

      <section className="min-h-0 overflow-hidden">
        <TransactionForm />
      </section>
    </div>
  );
};
