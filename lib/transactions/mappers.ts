import type { PackType, Transaction, TransactionStatus } from "@/lib/types/transaction";

type DatabaseTransactionStatus = TransactionStatus | "stock";

export type TransactionRow = {
  id: string;
  user_id: string;
  item_name: string;
  quantity_bought: number;
  buy_pack_type: PackType;
  buy_pack_price: number | string;
  sell_pack_type: PackType;
  sell_pack_price: number | string;
  quantity_sold: number;
  status: DatabaseTransactionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const mapTransactionRow = (row: TransactionRow): Transaction => {
  const status = row.status === "stock" ? "selling" : row.status;

  return {
    id: row.id,
    userId: row.user_id,
    itemName: row.item_name,
    quantityBought: row.quantity_bought,
    buyPackType: row.buy_pack_type,
    buyPackPrice: Number(row.buy_pack_price),
    sellPackType: row.sell_pack_type,
    sellPackPrice: Number(row.sell_pack_price),
    quantitySold: row.quantity_sold,
    status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};
