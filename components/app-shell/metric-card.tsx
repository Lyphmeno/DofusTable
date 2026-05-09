import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  tone?: "neutral" | "positive" | "negative" | "warning" | "muted";
};

export const MetricCard = ({ label, value, tone = "neutral" }: MetricCardProps) => {
  return (
    <section className="self-start rounded-md border border-border bg-surface p-[0.35rem] shadow-soft md:rounded-lg md:p-2">
      <p className="truncate text-[0.58rem] text-muted md:text-xs">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate text-[0.82rem] font-semibold tracking-normal md:mt-1 md:text-lg",
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
