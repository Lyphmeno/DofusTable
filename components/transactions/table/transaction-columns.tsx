"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { InlinePackType, InlineTransactionField, InlineTransactionStatus } from "@/components/transactions/inline-transaction-field";
import { TransactionTableRowActions } from "@/components/transactions/table/transaction-table-row-actions";
import { KamasValue } from "@/components/ui/kamas-value";
import { calculateTransaction, formatPercent } from "@/lib/transactions/calculations";
import { packSizes, type Transaction } from "@/lib/types/transaction";
import { cn } from "@/lib/utils/cn";

const createdDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit"
});

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => (
      <InlineTransactionField
        ariaLabel="Nom de l'item"
        className="min-w-[10rem]"
        field="itemName"
        id={row.original.id}
        value={row.original.itemName}
      />
    ),
    sortingFn: (a, b) => a.original.itemName.localeCompare(b.original.itemName, "fr-FR")
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="block text-center text-xs text-muted-foreground">
        {createdDateFormatter.format(new Date(row.original.createdAt))}
      </span>
    ),
    sortingFn: (a, b) => new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime()
  },
  {
    accessorKey: "buyPackType",
    header: "Lot ach.",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <InlinePackType ariaLabel="Lot achat" field="buyPackType" id={row.original.id} value={row.original.buyPackType} />
      </div>
    ),
    sortingFn: (a, b) => packSizes[a.original.buyPackType] - packSizes[b.original.buyPackType]
  },
  {
    id: "totalBuyPrice",
    header: "Total achat",
    cell: ({ row }) => (
      <span className="flex justify-center font-medium text-muted-foreground">
        <KamasValue value={calculateTransaction(row.original).totalBuyPrice} />
      </span>
    ),
    sortingFn: (a, b) => calculateTransaction(a.original).totalBuyPrice - calculateTransaction(b.original).totalBuyPrice
  },
  {
    accessorKey: "buyPackPrice",
    header: "Achat",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <InlineTransactionField
          ariaLabel="Prix achat"
          field="buyPackPrice"
          id={row.original.id}
          kind="kamas"
          value={row.original.buyPackPrice}
        />
      </div>
    )
  },
  {
    accessorKey: "sellPackType",
    header: "Lot rev.",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <InlinePackType ariaLabel="Lot vente" field="sellPackType" id={row.original.id} value={row.original.sellPackType} />
      </div>
    ),
    sortingFn: (a, b) => packSizes[a.original.sellPackType] - packSizes[b.original.sellPackType]
  },
  {
    accessorKey: "sellPackPrice",
    header: "Revente",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <InlineTransactionField
          ariaLabel="Prix vente"
          field="sellPackPrice"
          id={row.original.id}
          kind="kamas"
          value={row.original.sellPackPrice}
        />
      </div>
    )
  },
  {
    id: "listingTax",
    header: "Taxe",
    cell: ({ row }) => (
      <span className="flex justify-center font-medium text-muted-foreground">
        <KamasValue value={calculateTransaction(row.original).listingTax} />
      </span>
    ),
    sortingFn: (a, b) => calculateTransaction(a.original).listingTax - calculateTransaction(b.original).listingTax
  },
  {
    id: "profit",
    header: "Benef.",
    cell: ({ row }) => {
      const computed = calculateTransaction(row.original);
      const profitValue = row.original.status === "selling" ? computed.pendingProfit : computed.closedProfit;
      const profitRoi = row.original.status === "selling" ? computed.pendingRoi : computed.realizedRoi;
      const profitClass =
        row.original.status === "selling"
          ? "font-semibold text-primary"
          : profitValue >= 0
            ? "font-semibold text-success"
            : "font-semibold text-danger";

      return (
        <span className={cn("flex justify-center", profitClass)}>
          <KamasValue value={profitValue} /> <span className="mx-1 text-muted-foreground">·</span> {formatPercent(profitRoi)}
        </span>
      );
    },
    sortingFn: (a, b) => {
      const aComputed = calculateTransaction(a.original);
      const bComputed = calculateTransaction(b.original);
      const aValue = a.original.status === "selling" ? aComputed.pendingProfit : aComputed.closedProfit;
      const bValue = b.original.status === "selling" ? bComputed.pendingProfit : bComputed.closedProfit;

      return aValue - bValue;
    }
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <InlineTransactionStatus id={row.original.id} value={row.original.status} />
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TransactionTableRowActions id={row.original.id} />
      </div>
    )
  }
];
