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

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[82rem] table-fixed border-collapse">
            <thead className="bg-surface-soft">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="border-b border-border-soft" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium uppercase tracking-normal text-muted-foreground"
                        key={header.id}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md text-left uppercase transition",
                              "hover:text-foreground",
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
                <tr className="h-12 border-b border-border-soft transition last:border-b-0 hover:bg-surface-soft/60" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-foreground" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
