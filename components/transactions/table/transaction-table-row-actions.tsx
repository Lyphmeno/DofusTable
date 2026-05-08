"use client";

import { Trash2 } from "lucide-react";
import { deleteTransactionAction } from "@/app/actions/transactions";

type TransactionTableRowActionsProps = {
  id: string;
};

export const TransactionTableRowActions = ({ id }: TransactionTableRowActionsProps) => {
  return (
    <form action={deleteTransactionAction}>
      <input name="id" type="hidden" value={id} />
      <button
        aria-label="Supprimer"
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-soft text-danger transition hover:bg-surface-strong"
        type="submit"
      >
        <Trash2 size="0.875rem" />
      </button>
    </form>
  );
};
