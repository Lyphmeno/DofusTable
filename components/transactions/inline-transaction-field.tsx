"use client";

import { useRef, useTransition } from "react";
import { updateTransactionFieldAction } from "@/app/actions/transactions";
import type { PackType, TransactionStatus } from "@/lib/types/transaction";
import { KamasIcon } from "@/components/ui/kamas-icon";
import { cn } from "@/lib/utils/cn";

type InlineTransactionFieldProps = {
  id: string;
  field: string;
  value: string | number;
  ariaLabel: string;
  kind?: "text" | "number" | "kamas";
  className?: string;
  fill?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
};

export const InlineTransactionField = ({
  id,
  field,
  value,
  ariaLabel,
  kind = "text",
  className,
  fill = false,
  inputClassName,
  wrapperClassName
}: InlineTransactionFieldProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const valueLength = String(value).length;
  const adaptiveWidth = kind === "text" || fill ? undefined : `${Math.max(valueLength + 1, kind === "kamas" ? 4 : 2)}ch`;

  const submit = () => {
    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  };

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value={field} />
      <span className={cn("inline-flex min-w-0 max-w-full items-center gap-1", (kind === "text" || fill) && "w-full", className)}>
        <input
          aria-label={ariaLabel}
          className={cn(
            "h-7 min-w-0 max-w-full rounded-md border border-transparent bg-transparent py-1 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-surface-soft",
            (kind === "text" || fill) && "w-full truncate",
            kind === "number" && "px-2 text-right tabular-nums",
            kind === "kamas" && "px-1 text-right tabular-nums",
            inputClassName
          )}
          defaultValue={value}
          inputMode={kind === "text" ? "text" : "numeric"}
          min={kind === "text" ? undefined : 0}
          name="value"
          onBlur={submit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          style={adaptiveWidth ? { width: adaptiveWidth } : undefined}
          type={kind === "text" ? "text" : "number"}
        />
        {kind === "kamas" ? <KamasIcon className="h-3 w-3" /> : null}
      </span>
    </form>
  );
};

type InlinePackTypeProps = {
  id: string;
  field: "buyPackType" | "sellPackType";
  value: PackType;
  ariaLabel: string;
  className?: string;
  wrapperClassName?: string;
};

export const InlinePackType = ({ id, field, value, ariaLabel, className, wrapperClassName }: InlinePackTypeProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value={field} />
      <select
        aria-label={ariaLabel}
        className={cn(
          "h-7 w-full rounded-md border border-border bg-surface-soft px-2 text-xs font-semibold text-foreground outline-none focus:border-primary",
          className
        )}
        defaultValue={value}
        name="value"
        onChange={() => {
          startTransition(() => {
            formRef.current?.requestSubmit();
          });
        }}
      >
        <option value="unit">1</option>
        <option value="ten">10</option>
        <option value="hundred">100</option>
      </select>
    </form>
  );
};

type InlineTransactionStatusProps = {
  id: string;
  value: TransactionStatus;
  className?: string;
  wrapperClassName?: string;
};

export const InlineTransactionStatus = ({ id, value, className, wrapperClassName }: InlineTransactionStatusProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value="status" />
      <select
        aria-label="Statut"
        className={cn(
          "h-7 w-full rounded-md border border-border bg-surface-soft px-2 text-xs font-medium text-foreground outline-none focus:border-primary",
          className
        )}
        defaultValue={value}
        name="value"
        onChange={() => {
          startTransition(() => {
            formRef.current?.requestSubmit();
          });
        }}
      >
        <option value="selling">En vente</option>
        <option value="sold">Vendu</option>
        <option value="unsold">Invendu</option>
      </select>
    </form>
  );
};
