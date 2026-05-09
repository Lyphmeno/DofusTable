import { MetricCard } from "@/components/app-shell/metric-card";
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
    <div className="grid min-h-full min-w-0 gap-[0.5rem] md:h-full md:grid-rows-[auto_1fr] md:overflow-hidden">
      <section className="grid min-w-0 grid-cols-1 gap-[0.5rem] md:grid-cols-2">
        <MetricCard label="Bénéfice en attente" value={<KamasValue value={summary.pendingProfit} />} tone="warning" />
        <MetricCard label="Bénéfice réel" value={<KamasValue value={summary.realizedProfit} />} tone="positive" />
      </section>

      <section className="min-h-0 md:overflow-hidden">
        <TransactionForm />
      </section>
    </div>
  );
};
