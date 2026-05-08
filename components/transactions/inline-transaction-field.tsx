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
  wrapperClassName?: string;
};

export const InlineTransactionField = ({
  id,
  field,
  value,
  ariaLabel,
  kind = "text",
  className,
  wrapperClassName
}: InlineTransactionFieldProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const valueLength = String(value).length;
  const adaptiveWidth = kind === "text" ? undefined : `${Math.max(valueLength + 1, kind === "kamas" ? 4 : 2)}ch`;

  const submit = () => {
    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  };

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value={field} />
      <span className={cn("inline-flex w-full items-center gap-1", kind === "kamas" && "w-auto", className)}>
        <input
          aria-label={ariaLabel}
          className={cn(
            "min-w-0 rounded-md border border-transparent bg-transparent py-1.5 font-medium text-slate-100 outline-none transition focus:border-mint focus:bg-surface-soft md:py-2",
            kind === "text" && "w-full",
            kind === "number" && "px-2 text-center",
            kind === "kamas" && "px-1 text-center"
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
        {kind === "kamas" ? <KamasIcon className="h-3.5 w-3.5" /> : null}
      </span>
    </form>
  );
};

type InlinePackTypeProps = {
  id: string;
  field: "buyPackType" | "sellPackType";
  value: PackType;
  ariaLabel: string;
  wrapperClassName?: string;
};

export const InlinePackType = ({ id, field, value, ariaLabel, wrapperClassName }: InlinePackTypeProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value={field} />
      <select
        aria-label={ariaLabel}
        className="w-[3.8rem] rounded-md border border-border bg-surface-soft px-2 py-1.5 text-xs font-semibold text-slate-100 outline-none focus:border-mint md:w-[4.25rem] md:py-2 md:text-sm"
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
  wrapperClassName?: string;
};

export const InlineTransactionStatus = ({ id, value, wrapperClassName }: InlineTransactionStatusProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <form action={updateTransactionFieldAction} className={wrapperClassName} ref={formRef}>
      <input name="id" type="hidden" value={id} />
      <input name="field" type="hidden" value="status" />
      <select
        aria-label="Statut"
        className="w-full rounded-md border border-border bg-surface-soft px-2 py-1.5 text-xs font-medium text-slate-100 outline-none focus:border-mint md:py-2 md:text-sm"
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
