import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { SummaryMetrics } from "@/components/app-shell/summary-metrics";
import { TransactionTable } from "@/components/transactions/table/transaction-table";
import type { Transaction } from "@/lib/types/transaction";

type TableViewProps = {
  transactions: Transaction[];
};

export const TableView = ({ transactions }: TableViewProps) => {
  return (
    <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_auto_minmax(0,1fr)] content-start gap-[0.3rem] md:gap-[0.5rem] md:overflow-hidden">
      <div className="flex min-w-0 justify-end">
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-[0.35rem] rounded-md border border-border bg-surface-soft px-3 text-[0.82rem] font-medium text-muted-foreground transition hover:border-primary hover:text-foreground md:min-h-0 md:px-2 md:py-1 md:text-xs"
          href="/ajouter"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter
        </Link>
      </div>

      <SummaryMetrics transactions={transactions} />

      <section className="min-h-0 min-w-0">
        <TransactionTable transactions={transactions} />
      </section>
    </div>
  );
};
