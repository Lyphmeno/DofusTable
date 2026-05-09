"use client";

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
const compactColumnIds = new Set(["buyPackType", "sellPackType", "profitRoi", "createdAt"]);
const separatedColumnIds = new Set(["itemName", "totalBuyPrice", "sellPackPrice", "profitRoi"]);
const afterSeparatorColumnIds = new Set(["buyPackType", "sellPackType", "listingTax", "status"]);
const snapStartColumnIds = new Set(["itemName", "buyPackType", "sellPackType", "listingTax", "status"]);

const getCellPaddingClassName = (columnId: string) => {
  if (columnId === "actions") {
    return "px-0.5";
  }

  if (separatedColumnIds.has(columnId)) {
    return compactColumnIds.has(columnId) ? "pl-0.5 pr-2 md:pl-1 md:pr-3" : "pl-1 pr-2 md:pl-2 md:pr-3";
  }

  if (afterSeparatorColumnIds.has(columnId)) {
    return compactColumnIds.has(columnId) ? "pl-2 pr-0.5 md:pl-3 md:pr-1" : "pl-2 pr-1 md:pl-3 md:pr-2";
  }

  if (compactColumnIds.has(columnId)) {
    return "px-0.5 md:px-1";
  }

  return "px-1 md:px-2";
};

const getColumnSeparatorClassName = (columnId: string) => {
  return separatedColumnIds.has(columnId) ? "border-r border-border-soft" : undefined;
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
    <section className="scrollbar-none h-full min-h-0 overflow-y-auto pb-1.5 md:pb-4">
      <div className="max-w-full overflow-hidden rounded-md border border-border bg-surface shadow-soft md:rounded-lg">
        <div className="scrollbar-none w-full snap-x snap-proximity scroll-px-1 overflow-x-auto overscroll-x-contain md:snap-none">
          <table className="w-full min-w-[68rem] table-fixed border-collapse md:min-w-[74rem] xl:min-w-full">
            <colgroup>
              {table.getAllLeafColumns().map((column) => (
                <col key={column.id} style={{ width: `${column.getSize()}%` }} />
              ))}
            </colgroup>
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
                          "overflow-hidden text-ellipsis whitespace-nowrap py-1 text-[0.58rem] font-medium uppercase tracking-normal text-muted-foreground md:py-2 md:text-[0.7rem]",
                          getCellPaddingClassName(header.column.id),
                          getColumnSeparatorClassName(header.column.id),
                          snapStartColumnIds.has(header.column.id) && "snap-start scroll-ml-1 md:snap-align-none",
                          alignClassName
                        )}
                        key={header.id}
                        style={{ width: `${header.getSize()}%` }}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            className={cn(
                              "inline-flex w-full max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md uppercase transition",
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td className="px-2 py-3 text-center text-[0.7rem] text-muted md:py-6 md:text-sm" colSpan={table.getAllLeafColumns().length}>
                    Aucune transaction pour le moment.
                  </td>
                </tr>
              ) : null}
              {table.getRowModel().rows.map((row) => (
                <tr className="h-7 border-b border-border-soft transition last:border-b-0 hover:bg-surface-soft/60 md:h-10" key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const alignClassName = rightAlignedColumnIds.has(cell.column.id)
                      ? "text-right"
                      : centerAlignedColumnIds.has(cell.column.id)
                        ? "text-center"
                        : "text-left";

                    return (
                      <td
                        className={cn(
                          "overflow-hidden text-ellipsis whitespace-nowrap py-1 text-[0.65rem] text-foreground md:py-2 md:text-xs",
                          getCellPaddingClassName(cell.column.id),
                          getColumnSeparatorClassName(cell.column.id),
                          snapStartColumnIds.has(cell.column.id) && "snap-start scroll-ml-1 md:snap-align-none",
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
      </div>
    </section>
  );
};
