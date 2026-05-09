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
        className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-border bg-surface-soft text-danger transition hover:bg-surface-strong md:h-6 md:w-6"
        type="submit"
      >
        <Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3" />
      </button>
    </form>
  );
};
