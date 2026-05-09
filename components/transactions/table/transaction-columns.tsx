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

const kamaIconClassName = "h-2.5 w-2.5 md:h-3 md:w-3";
const compactPackSelectClassName = "h-6 w-[4.25rem] px-2 text-[0.72rem] md:h-7 md:text-xs";
const statusSortOrder: Record<Transaction["status"], number> = {
  selling: 0,
  sold: 1,
  unsold: 2
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-2" title={row.original.itemName}>
        {row.original.itemIconUrl ? (
          <img
            alt=""
            className="h-4 w-4 shrink-0 rounded-sm object-contain md:h-5 md:w-5"
            height={20}
            loading="lazy"
            src={row.original.itemIconUrl}
            width={20}
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">{row.original.itemName}</span>
      </div>
    ),
    size: 15,
    minSize: 15,
    maxSize: 18,
    sortingFn: (a, b) => a.original.itemName.localeCompare(b.original.itemName, "fr-FR")
  },
  {
    accessorKey: "buyPackType",
    header: "Lot ach.",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-center overflow-hidden">
        <InlinePackType
          ariaLabel="Lot achat"
          className={compactPackSelectClassName}
          field="buyPackType"
          id={row.original.id}
          value={row.original.buyPackType}
          wrapperClassName="min-w-[4.25rem]"
        />
      </div>
    ),
    size: 6.5,
    minSize: 6.5,
    maxSize: 7,
    sortingFn: (a, b) => packSizes[a.original.buyPackType] - packSizes[b.original.buyPackType]
  },
  {
    accessorKey: "buyPackPrice",
    header: "Achat",
    cell: ({ row }) => (
      <div className="flex min-w-0 tabular-nums justify-end">
        <InlineTransactionField
          ariaLabel="Prix achat"
          className="w-full justify-end"
          field="buyPackPrice"
          fill
          id={row.original.id}
          kind="kamas"
          wrapperClassName="min-w-0 w-full"
          value={row.original.buyPackPrice}
        />
      </div>
    ),
    size: 7,
    minSize: 7,
    sortingFn: (a, b) => a.original.buyPackPrice - b.original.buyPackPrice
  },
  {
    id: "totalBuyPrice",
    accessorFn: (row) => calculateTransaction(row).totalBuyPrice,
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
    size: 8,
    minSize: 8,
    sortingFn: "basic"
  },
  {
    accessorKey: "sellPackType",
    header: "Lot rev.",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-center overflow-hidden">
        <InlinePackType
          ariaLabel="Lot vente"
          className={compactPackSelectClassName}
          field="sellPackType"
          id={row.original.id}
          value={row.original.sellPackType}
          wrapperClassName="min-w-[4.25rem]"
        />
      </div>
    ),
    size: 6.5,
    minSize: 6.5,
    maxSize: 7,
    sortingFn: (a, b) => packSizes[a.original.sellPackType] - packSizes[b.original.sellPackType]
  },
  {
    accessorKey: "sellPackPrice",
    header: "Revente",
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-end">
        <InlineTransactionField
          ariaLabel="Prix vente"
          className="w-full justify-end"
          field="sellPackPrice"
          fill
          id={row.original.id}
          kind="kamas"
          wrapperClassName="min-w-0 w-full"
          value={row.original.sellPackPrice}
        />
      </div>
    ),
    size: 7,
    minSize: 7,
    sortingFn: (a, b) => a.original.sellPackPrice - b.original.sellPackPrice
  },
  {
    id: "listingTax",
    accessorFn: (row) => calculateTransaction(row).listingTax,
    header: "Taxe",
    cell: ({ row }) => (
      <span className="flex min-w-0 justify-end truncate font-medium tabular-nums text-muted-foreground" title={`${calculateTransaction(row.original).listingTax}`}>
        <KamasValue className="min-w-0 truncate" iconClassName={kamaIconClassName} value={calculateTransaction(row.original).listingTax} />
      </span>
    ),
    size: 6,
    minSize: 6,
    sortingFn: "basic"
  },
  {
    id: "profit",
    accessorFn: (row) => calculateTransaction(row).profit,
    header: "Bénéf.",
    cell: ({ row }) => {
      const computed = calculateTransaction(row.original);
      const profitValue = computed.profit;
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
    size: 7,
    minSize: 6,
    sortingFn: "basic"
  },
  {
    id: "profitRoi",
    accessorFn: (row) => calculateTransaction(row).profitRoi,
    header: () => (
      <>
        <span className="hidden sm:inline">% profit</span>
        <span className="sm:hidden">ROI</span>
      </>
    ),
    cell: ({ row }) => {
      const computed = calculateTransaction(row.original);
      const profitValue = computed.profit;
      const profitRoi = computed.profitRoi;
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
    size: 5,
    minSize: 4.5,
    maxSize: 5.5,
    sortingFn: "basic"
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <InlineTransactionStatus
        className="h-6 min-w-[6.25rem] px-2 text-[0.72rem] md:h-7 md:text-xs"
        id={row.original.id}
        value={row.original.status}
        wrapperClassName="ml-auto min-w-[6.25rem]"
      />
    ),
    size: 9,
    minSize: 9,
    sortingFn: (a, b) => statusSortOrder[a.original.status] - statusSortOrder[b.original.status]
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="block min-w-0 truncate text-center text-[0.7rem] tabular-nums text-muted-foreground">
        {createdDateFormatter.format(new Date(row.original.createdAt))}
      </span>
    ),
    size: 4.5,
    minSize: 3.5,
    maxSize: 4.5,
    sortingFn: (a, b) => new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime()
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex min-w-0 justify-center">
        <TransactionTableRowActions id={row.original.id} />
      </div>
    ),
    size: 3.5,
    minSize: 2.5,
    maxSize: 3.5
  }
];
