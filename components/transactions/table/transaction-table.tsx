"use client";

import { RotateCcw } from "lucide-react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { transactionColumns } from "@/components/transactions/table/transaction-columns";
import type { Transaction } from "@/lib/types/transaction";
import { cn } from "@/lib/utils/cn";

type TransactionTableProps = {
  transactions: Transaction[];
};

const rightAlignedColumnIds = new Set(["totalBuyPrice", "buyPackPrice", "sellPackPrice", "listingTax", "profit", "profitRoi"]);
const centerAlignedColumnIds = new Set(["buyPackType", "sellPackType", "createdAt", "actions"]);

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <section className="h-full min-h-0 overflow-y-auto pb-4">
      <div className="mb-2 flex justify-end md:mb-3">
        <button
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-soft px-3 text-xs font-medium text-muted-foreground transition hover:bg-surface-strong"
          onClick={() => setSorting([{ id: "createdAt", desc: true }])}
          type="button"
        >
          <RotateCcw size="0.875rem" />
          Reset
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/70 p-6 text-center text-sm leading-6 text-muted">
          Aucune transaction pour le moment.
        </div>
      ) : null}

      <div className="max-w-full overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
        <table className="w-full max-w-full table-fixed border-collapse">
          <thead className="bg-surface-soft">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-b border-border-soft" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const alignClassName = rightAlignedColumnIds.has(header.column.id)
                    ? "text-right"
                    : centerAlignedColumnIds.has(header.column.id)
                      ? "text-center"
                      : "text-left";

                  return (
                    <th
                      className={cn(
                        "overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2 text-[0.7rem] font-medium uppercase tracking-normal text-muted-foreground",
                        alignClassName
                      )}
                      key={header.id}
                      style={{ width: `${header.getSize()}%` }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className={cn(
                            "inline-flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md uppercase transition",
                            "hover:text-foreground",
                            rightAlignedColumnIds.has(header.column.id) && "justify-end text-right",
                            centerAlignedColumnIds.has(header.column.id) && "justify-center text-center",
                            !rightAlignedColumnIds.has(header.column.id) && !centerAlignedColumnIds.has(header.column.id) && "text-left",
                            sorted && "text-primary"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="h-10 border-b border-border-soft transition last:border-b-0 hover:bg-surface-soft/60" key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const alignClassName = rightAlignedColumnIds.has(cell.column.id)
                    ? "text-right"
                    : centerAlignedColumnIds.has(cell.column.id)
                      ? "text-center"
                      : "text-left";

                  return (
                    <td
                      className={cn(
                        "overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2 text-xs text-foreground",
                        alignClassName
                      )}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
