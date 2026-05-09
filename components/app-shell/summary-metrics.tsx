import { MetricCard } from "@/components/app-shell/metric-card";
import { KamasValue } from "@/components/ui/kamas-value";
import { summarizeTransactions } from "@/lib/transactions/calculations";
import type { Transaction } from "@/lib/types/transaction";

type SummaryMetricsProps = {
  transactions: Transaction[];
};

const getProfitTone = (value: number) => {
  if (value > 0) {
    return "positive";
  }

  if (value < 0) {
    return "negative";
  }

  return "warning";
};

export const SummaryMetrics = ({ transactions }: SummaryMetricsProps) => {
  const summary = summarizeTransactions(transactions);

  return (
    <section className="grid min-w-0 grid-cols-2 items-start gap-[0.3rem] self-start md:gap-[0.5rem]">
      <MetricCard label="Bénéfice en attente" value={<KamasValue value={summary.pendingProfit} />} tone="warning" />
      <MetricCard label="Bénéfice réel" value={<KamasValue value={summary.realizedProfit} />} tone={getProfitTone(summary.realizedProfit)} />
    </section>
  );
};
