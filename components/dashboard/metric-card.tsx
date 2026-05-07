import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  tone?: "neutral" | "positive" | "warning";
};

export const MetricCard = ({ label, value, tone = "neutral" }: MetricCardProps) => {
  return (
    <section className="rounded-lg border border-line bg-panel p-2 shadow-soft">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-semibold tracking-normal",
          tone === "positive" && "text-mint",
          tone === "warning" && "text-kamas"
        )}
      >
        {value}
      </p>
    </section>
  );
};
