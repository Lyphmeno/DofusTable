import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { deleteTransactionAction } from "@/app/actions/transactions";
import { calculateTransaction, formatPercent } from "@/lib/transactions/calculations";
import type { Transaction } from "@/lib/types/transaction";
import { InlinePackType, InlineTransactionField, InlineTransactionStatus } from "@/components/transactions/inline-transaction-field";
import { KamasValue } from "@/components/ui/kamas-value";
import { cn } from "@/lib/utils/cn";

type TransactionColumn = "item" | "buyPack" | "buyPrice" | "sellPack" | "sellPrice" | "tax" | "profit" | "status" | "date";

type TransactionCardProps = {
  transaction: Transaction;
  highlightedColumn?: TransactionColumn | null;
};

export const TransactionCard = ({ highlightedColumn, transaction }: TransactionCardProps) => {
  const computed = calculateTransaction(transaction);
  const createdDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(transaction.createdAt));
  const profitValue = computed.profit;
  const profitRoi = computed.profitRoi;
  const profitClass =
    transaction.status === "selling"
      ? "font-semibold text-primary"
      : profitValue >= 0
        ? "font-semibold text-success"
        : "font-semibold text-danger";

  return (
    <article className="rounded-lg border border-border bg-surface px-3 py-2 shadow-soft md:py-3">
      <div className="grid grid-cols-[minmax(13rem,1.8fr)_0.5fr_0.55fr_0.75fr_0.55fr_0.8fr_0.75fr_1fr_0.9fr_2.5rem] items-center gap-3 text-xs md:gap-4 md:text-sm">
        <DesktopCell column="item" highlightedColumn={highlightedColumn}>
          <InlineTransactionField
            ariaLabel="Nom de l'item"
            className="min-w-0 flex-1"
            field="itemName"
            id={transaction.id}
            value={transaction.itemName}
          />
        </DesktopCell>
        <DesktopCell align="center" column="buyPack" highlightedColumn={highlightedColumn}>
          <InlinePackType ariaLabel="Lot achat" field="buyPackType" id={transaction.id} value={transaction.buyPackType} />
        </DesktopCell>
        <DesktopCell align="center" column="buyPrice" highlightedColumn={highlightedColumn}>
          <InlineTransactionField ariaLabel="Prix achat" field="buyPackPrice" id={transaction.id} kind="kamas" value={transaction.buyPackPrice} />
        </DesktopCell>
        <DesktopCell align="center" column="sellPack" highlightedColumn={highlightedColumn}>
          <InlinePackType ariaLabel="Lot vente" field="sellPackType" id={transaction.id} value={transaction.sellPackType} />
        </DesktopCell>
        <DesktopCell align="center" column="sellPrice" highlightedColumn={highlightedColumn}>
          <InlineTransactionField ariaLabel="Prix vente" field="sellPackPrice" id={transaction.id} kind="kamas" value={transaction.sellPackPrice} />
        </DesktopCell>
        <DesktopCell align="center" column="tax" highlightedColumn={highlightedColumn}>
          <span className="font-medium text-muted-foreground">
          <KamasValue value={computed.listingTax} />
          </span>
        </DesktopCell>
        <DesktopCell align="center" column="profit" highlightedColumn={highlightedColumn}>
          <span className={profitClass}>
            <KamasValue value={profitValue} /> · {formatPercent(profitRoi)}
          </span>
        </DesktopCell>
        <DesktopCell column="status" highlightedColumn={highlightedColumn}>
          <InlineTransactionStatus id={transaction.id} value={transaction.status} />
        </DesktopCell>
        <DesktopCell align="center" column="date" highlightedColumn={highlightedColumn}>
          <span className="text-xs text-muted">{createdDate}</span>
        </DesktopCell>
        <div className="justify-self-end">
          <DeleteTransactionButton id={transaction.id} />
        </div>
      </div>
    </article>
  );
};

type DesktopCellProps = {
  align?: "center";
  children: ReactNode;
  column: TransactionColumn;
  highlightedColumn?: TransactionColumn | null;
};

export const DesktopCell = ({ align, children, column, highlightedColumn }: DesktopCellProps) => {
  return (
    <div
      className={cn(
        "min-w-0 w-full rounded-md px-2 py-1.5 transition md:py-2",
        align === "center" && "flex justify-center text-center",
        highlightedColumn === column && "bg-success/10 ring-1 ring-success/20"
      )}
    >
      {children}
    </div>
  );
};

type DeleteTransactionButtonProps = {
  id: string;
};

export const DeleteTransactionButton = ({ id }: DeleteTransactionButtonProps) => {
  return (
    <form action={deleteTransactionAction}>
      <input name="id" type="hidden" value={id} />
      <button className="rounded-md border border-border bg-surface-soft p-2 text-danger" type="submit" aria-label="Supprimer">
        <Trash2 size="1rem" />
      </button>
    </form>
  );
};
