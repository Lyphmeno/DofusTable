"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { calculateTransaction } from "@/lib/transactions/calculations";
import { packSizes } from "@/lib/types/transaction";
import type { Transaction } from "@/lib/types/transaction";
import { cn } from "@/lib/utils/cn";

type TableViewProps = {
  transactions: Transaction[];
};

export type TransactionColumn = "item" | "date" | "buyPack" | "buyPrice" | "sellPack" | "sellPrice" | "tax" | "profit" | "status";

type SortDirection = "asc" | "desc";

type SortState = {
  column: TransactionColumn;
  direction: SortDirection;
};

const defaultSort: SortState = {
  column: "date",
  direction: "desc"
};

const columns: Array<{
  key: TransactionColumn;
  label: string;
  align?: "center";
}> = [
  { key: "item", label: "Item" },
  { key: "date", label: "Date", align: "center" },
  { key: "buyPack", label: "Lot ach.", align: "center" },
  { key: "buyPrice", label: "Achat", align: "center" },
  { key: "sellPack", label: "Lot rev.", align: "center" },
  { key: "sellPrice", label: "Revente", align: "center" },
  { key: "tax", label: "Taxe", align: "center" },
  { key: "profit", label: "Benef.", align: "center" },
  { key: "status", label: "Statut" }
];

const getSortValue = (transaction: Transaction, column: TransactionColumn): string | number => {
  const computed = calculateTransaction(transaction);

  switch (column) {
    case "item":
      return transaction.itemName.toLocaleLowerCase("fr-FR");
    case "date":
      return new Date(transaction.createdAt).getTime();
    case "buyPack":
      return packSizes[transaction.buyPackType];
    case "buyPrice":
      return transaction.buyPackPrice;
    case "sellPack":
      return packSizes[transaction.sellPackType];
    case "sellPrice":
      return transaction.sellPackPrice;
    case "tax":
      return computed.listingTax;
    case "profit":
      return transaction.status === "selling" ? computed.pendingProfit : computed.closedProfit;
    case "status":
      return transaction.status;
  }
};

export const TableView = ({ transactions }: TableViewProps) => {
  const [hoveredColumn, setHoveredColumn] = useState<TransactionColumn | null>(null);
  const [sort, setSort] = useState<SortState>(defaultSort);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aValue = getSortValue(a, sort.column);
      const bValue = getSortValue(b, sort.column);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      const comparison = String(aValue).localeCompare(String(bValue), "fr-FR");
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [sort, transactions]);

  const toggleSort = (column: TransactionColumn) => {
    setSort((current) => {
      if (current.column === column) {
        return {
          column,
          direction: current.direction === "asc" ? "desc" : "asc"
        };
      }

      return {
        column,
        direction: column === "date" ? "desc" : "asc"
      };
    });
  };

  return (
    <section className="h-full min-h-0 overflow-y-auto pb-4">
      <div className="mb-2 flex justify-end md:mb-3">
        <button
          className="inline-flex items-center gap-2 rounded-md border border-line bg-panelSoft px-2 py-1.5 text-xs font-medium text-slate-300 md:px-3 md:py-2 md:text-sm"
          onClick={() => setSort(defaultSort)}
          type="button"
        >
          <RotateCcw size="0.875rem" />
          Reset
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-panel/70 p-6 text-center text-sm leading-6 text-slate-400">
          Aucune transaction pour le moment.
        </div>
      ) : null}

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[66rem]">
          <div className="mb-2 grid grid-cols-[minmax(13rem,1.8fr)_0.5fr_0.55fr_0.75fr_0.55fr_0.8fr_0.75fr_1fr_0.9fr_2.5rem] gap-3 px-3 text-[0.68rem] font-medium uppercase tracking-normal text-slate-500 md:mb-3 md:gap-4 md:px-4 md:text-xs">
            {columns.map((column) => (
              <button
                className={cn(
                  "rounded-md px-2 py-2 text-left uppercase tracking-normal transition",
                  column.align === "center" && "text-center",
                  hoveredColumn === column.key && "bg-mint/10 text-slate-100",
                  sort.column === column.key && "text-kamas"
                )}
                key={column.key}
                onClick={() => toggleSort(column.key)}
                onMouseEnter={() => setHoveredColumn(column.key)}
                onMouseLeave={() => setHoveredColumn(null)}
                type="button"
              >
                {column.label}
                {sort.column === column.key ? (sort.direction === "asc" ? " ↑" : " ↓") : null}
              </button>
            ))}
            <span />
          </div>

          <div className="space-y-2">
            {sortedTransactions.map((transaction) => (
              <TransactionCard highlightedColumn={hoveredColumn} key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
