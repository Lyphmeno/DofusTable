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

const kamaIconClassName = "h-3 w-3";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-2 truncate" title={row.original.itemName}>
        {row.original.itemIconUrl ? (
          <img
            alt=""
            className="h-5 w-5 shrink-0 rounded-sm object-contain"
            height={20}
            loading="lazy"
            src={row.original.itemIconUrl}
            width={20}
          />
        ) : null}
        <InlineTransactionField
          ariaLabel="Nom de l'item"
          className="w-full truncate"
          field="itemName"
          id={row.original.id}
          value={row.original.itemName}
          wrapperClassName="min-w-0 flex-1"
        />
      </div>
    ),
    size: 20,
    sortingFn: (a, b) => a.original.itemName.localeCompare(b.original.itemName, "fr-FR")
  },
  {
    accessorKey: "buyPackType",
    header: "Lot ach.",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-center">
        <InlinePackType ariaLabel="Lot achat" field="buyPackType" id={row.original.id} value={row.original.buyPackType} />
      </div>
    ),
    size: 7,
    sortingFn: (a, b) => packSizes[a.original.buyPackType] - packSizes[b.original.buyPackType]
  },
  {
    id: "totalBuyPrice",
    header: () => (
      <>
        <span className="hidden sm:inline">Total achat</span>
        <span className="sm:hidden">Total</span>
      </>
    ),
    cell: ({ row }) => (
      <span className="flex min-w-0 justify-end truncate font-medium tabular-nums text-muted-foreground" title={`${calculateTransaction(row.original).totalBuyPrice}`}>
        <KamasValue className="min-w-0 truncate" iconClassName={kamaIconClassName} value={calculateTransaction(row.original).totalBuyPrice} />
      </span>
    ),
    size: 9,
    sortingFn: (a, b) => calculateTransaction(a.original).totalBuyPrice - calculateTransaction(b.original).totalBuyPrice
  },
  {
    accessorKey: "buyPackPrice",
    header: "Achat",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-end">
        <InlineTransactionField
          ariaLabel="Prix achat"
          className="justify-end"
          field="buyPackPrice"
          id={row.original.id}
          kind="kamas"
          value={row.original.buyPackPrice}
        />
      </div>
    ),
    size: 8
  },
  {
    accessorKey: "sellPackType",
    header: "Lot rev.",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-center">
        <InlinePackType ariaLabel="Lot vente" field="sellPackType" id={row.original.id} value={row.original.sellPackType} />
      </div>
    ),
    size: 7,
    sortingFn: (a, b) => packSizes[a.original.sellPackType] - packSizes[b.original.sellPackType]
  },
  {
    accessorKey: "sellPackPrice",
    header: "Revente",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-end">
        <InlineTransactionField
          ariaLabel="Prix vente"
          className="justify-end"
          field="sellPackPrice"
          id={row.original.id}
          kind="kamas"
          value={row.original.sellPackPrice}
        />
      </div>
    ),
    size: 8
  },
  {
    id: "listingTax",
    header: "Taxe",
    cell: ({ row }) => (
      <span className="flex min-w-0 justify-end truncate font-medium tabular-nums text-muted-foreground" title={`${calculateTransaction(row.original).listingTax}`}>
        <KamasValue className="min-w-0 truncate" iconClassName={kamaIconClassName} value={calculateTransaction(row.original).listingTax} />
      </span>
    ),
    size: 8,
    sortingFn: (a, b) => calculateTransaction(a.original).listingTax - calculateTransaction(b.original).listingTax
  },
  {
    id: "profit",
    header: "Bénéf.",
    cell: ({ row }) => {
      const computed = calculateTransaction(row.original);
      const profitValue = row.original.status === "selling" ? computed.pendingProfit : computed.closedProfit;
      const profitClass =
        row.original.status === "selling"
          ? "font-semibold text-primary"
          : profitValue >= 0
            ? "font-semibold text-success"
            : "font-semibold text-danger";

      return (
        <span className={cn("flex min-w-0 justify-end truncate tabular-nums", profitClass)} title={`${profitValue}`}>
          <KamasValue className="min-w-0 truncate" iconClassName={kamaIconClassName} value={profitValue} />
        </span>
      );
    },
    size: 9,
    sortingFn: (a, b) => {
      const aComputed = calculateTransaction(a.original);
      const bComputed = calculateTransaction(b.original);
      const aValue = a.original.status === "selling" ? aComputed.pendingProfit : aComputed.closedProfit;
      const bValue = b.original.status === "selling" ? bComputed.pendingProfit : bComputed.closedProfit;

      return aValue - bValue;
    }
  },
  {
    id: "profitRoi",
    header: () => (
      <>
        <span className="hidden sm:inline">% profit</span>
        <span className="sm:hidden">ROI</span>
      </>
    ),
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
        <span className={cn("block min-w-0 truncate text-right tabular-nums", profitClass)} title={formatPercent(profitRoi)}>
          {formatPercent(profitRoi)}
        </span>
      );
    },
    size: 6,
    sortingFn: (a, b) => {
      const aComputed = calculateTransaction(a.original);
      const bComputed = calculateTransaction(b.original);
      const aValue = a.original.status === "selling" ? aComputed.pendingRoi : aComputed.realizedRoi;
      const bValue = b.original.status === "selling" ? bComputed.pendingRoi : bComputed.realizedRoi;

      return aValue - bValue;
    }
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <InlineTransactionStatus id={row.original.id} value={row.original.status} />,
    size: 9
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="block min-w-0 truncate text-right text-xs text-muted-foreground">
        {createdDateFormatter.format(new Date(row.original.createdAt))}
      </span>
    ),
    size: 5,
    sortingFn: (a, b) => new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime()
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-end">
        <TransactionTableRowActions id={row.original.id} />
      </div>
    ),
    size: 4
  }
];
