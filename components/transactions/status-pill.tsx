import type { TransactionStatus } from "@/lib/types/transaction";

const statusLabels: Record<TransactionStatus, string> = {
  selling: "En vente",
  sold: "Vendu",
  unsold: "Invendu"
};

const statusClasses: Record<TransactionStatus, string> = {
  selling: "bg-kamas/20 text-kamas",
  sold: "bg-mint/20 text-mint",
  unsold: "bg-coral/20 text-coral"
};

type StatusPillProps = {
  status: TransactionStatus;
};

export const StatusPill = ({ status }: StatusPillProps) => {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
};
