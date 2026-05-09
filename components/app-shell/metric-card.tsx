import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  tone?: "neutral" | "positive" | "negative" | "warning" | "muted";
};

export const MetricCard = ({ label, value, tone = "neutral" }: MetricCardProps) => {
  return (
    <section className="rounded-lg border border-border bg-surface p-2 shadow-soft">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-semibold tracking-normal",
          tone === "positive" && "text-success",
          tone === "negative" && "text-danger",
          tone === "warning" && "text-primary",
          tone === "muted" && "text-muted-foreground"
        )}
      >
        {value}
      </p>
    </section>
  );
};
