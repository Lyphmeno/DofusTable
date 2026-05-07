import { formatKamas } from "@/lib/transactions/calculations";
import { KamasIcon } from "@/components/ui/kamas-icon";

type KamasValueProps = {
  value: number;
  className?: string;
};

export const KamasValue = ({ value, className }: KamasValueProps) => {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className ?? ""}`}>
      {formatKamas(value)}
      <KamasIcon />
    </span>
  );
};
