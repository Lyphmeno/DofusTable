import { findCachedDofusItem } from "@/lib/items/dofus-items-cache";
import type { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapTransactionRow, type TransactionRow } from "@/lib/transactions/mappers";

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

export const getTransactions = async (supabase: SupabaseServerClient) => {
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  return ((data ?? []) as TransactionRow[]).map((row) => {
    const transaction = mapTransactionRow(row);

    if (transaction.itemIconUrl) {
      return transaction;
    }

    const cachedItem = findCachedDofusItem(transaction.itemId, transaction.itemName);

    return {
      ...transaction,
      itemIconUrl: cachedItem?.iconUrl ?? null
    };
  });
};
