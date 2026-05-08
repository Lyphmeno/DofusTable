import type { TransactionStatus } from "@/lib/types/transaction";

const statusLabels: Record<TransactionStatus, string> = {
  selling: "En vente",
  sold: "Vendu",
  unsold: "Invendu"
};

const statusClasses: Record<TransactionStatus, string> = {
  selling: "bg-primary/20 text-primary",
  sold: "bg-success/20 text-success",
  unsold: "bg-danger/20 text-danger"
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
