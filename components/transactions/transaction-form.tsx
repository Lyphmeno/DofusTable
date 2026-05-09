"use client";

import { Package, Plus, ReceiptText, ShoppingBag, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { createTransactionAction } from "@/app/actions/transactions";
import { ItemCombobox } from "@/components/items/item-combobox";
import { KamasIcon } from "@/components/ui/kamas-icon";
import { KamasValue } from "@/components/ui/kamas-value";
import type { DofusItem } from "@/lib/items/dofus-items";
import { formatKamas } from "@/lib/transactions/calculations";
import { packSizes, type PackType } from "@/lib/types/transaction";

type NumericFieldName = "buyPackPrice" | "quantityBought" | "sellPackPrice";

type PackFieldName = "buyPackType" | "sellPackType";

type FormSectionProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

type NumberFieldProps = {
  label: string;
  min?: string;
  name: NumericFieldName;
  onChange: (name: NumericFieldName, value: string) => void;
  value: string;
};

type PackSelectProps = {
  label: string;
  name: PackFieldName;
  onChange: (name: PackFieldName, value: PackType) => void;
  value: PackType;
};

const packLabels: Record<PackType, string> = {
  unit: "Lot de 1",
  ten: "Lot de 10",
  hundred: "Lot de 100"
};

const fieldClassName =
  "mt-[0.35rem] h-12 w-full rounded-[0.65rem] border border-border bg-input px-[0.62rem] text-[0.95rem] text-foreground outline-none transition focus:border-primary focus:bg-surface-soft";

const labelClassName = "text-[0.78rem] font-medium text-muted-foreground";

const toNumber = (value: string) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getToneClassName = (value: number) => {
  if (value > 0) {
    return "text-success";
  }

  if (value < 0) {
    return "text-danger";
  }

  return "text-muted-foreground";
};

const formatRoi = (value: number) => {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1
  }).format(value)} %`;
};

export const FormSection = ({ children, icon, title }: FormSectionProps) => {
  return (
    <section className="rounded-[0.85rem] border border-border bg-surface-soft/70 p-[0.75rem]">
      <div className="mb-[0.55rem] flex items-center gap-[0.5rem]">
        <span className="flex h-[1.55rem] w-[1.55rem] items-center justify-center rounded-[0.55rem] bg-success/10 text-success">
          {icon}
        </span>
        <h3 className="text-[0.9rem] font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
};

export const NumberField = ({ label, min = "0", name, onChange, value }: NumberFieldProps) => {
  return (
    <label className="block">
      <span className={labelClassName}>{label}</span>
      <input
        className={fieldClassName}
        min={min}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        required
        type="number"
        value={value}
      />
    </label>
  );
};

export const PackSelect = ({ label, name, onChange, value }: PackSelectProps) => {
  return (
    <label className="block">
      <span className={labelClassName}>{label}</span>
      <select
        className={fieldClassName}
        name={name}
        onChange={(event) => onChange(name, event.target.value as PackType)}
        value={value}
      >
        {Object.entries(packLabels).map(([packType, packLabel]) => (
          <option key={packType} value={packType}>
            {packLabel}
          </option>
        ))}
      </select>
    </label>
  );
};

export const UnitPreview = ({ value }: { value: number }) => {
  return (
    <div className="mt-[0.55rem] rounded-[0.65rem] bg-surface p-[0.55rem] text-[0.82rem] font-medium text-muted-foreground">
      = <span className="tabular-nums text-foreground">{formatKamas(value)}</span> K / Lot de 1
    </div>
  );
};

export const SummaryRow = ({ label, toneClassName, value }: { label: string; toneClassName?: string; value: ReactNode }) => {
  return (
    <div className="flex min-w-0 items-center justify-between gap-[0.75rem] rounded-[0.65rem] bg-surface-soft p-[0.55rem]">
      <span className="min-w-0 text-[0.78rem] text-muted">{label}</span>
      <span className={`shrink-0 text-right text-[0.88rem] font-semibold tabular-nums ${toneClassName ?? "text-foreground"}`}>{value}</span>
    </div>
  );
};

export const TransactionForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState<DofusItem | null>(null);
  const [numbers, setNumbers] = useState<Record<NumericFieldName, string>>({
    quantityBought: "1",
    buyPackPrice: "0",
    sellPackPrice: "0"
  });
  const [packs, setPacks] = useState<Record<PackFieldName, PackType>>({
    buyPackType: "unit",
    sellPackType: "unit"
  });

  const preview = useMemo(() => {
    const quantityBought = toNumber(numbers.quantityBought);
    const buyPackPrice = toNumber(numbers.buyPackPrice);
    const sellPackPrice = toNumber(numbers.sellPackPrice);
    const buyPackSize = packSizes[packs.buyPackType];
    const sellPackSize = packSizes[packs.sellPackType];
    const buyUnitPrice = buyPackPrice / buyPackSize;
    const sellUnitPrice = sellPackPrice / sellPackSize;
    const totalBuyPrice = buyUnitPrice * quantityBought;
    const totalSellPrice = sellUnitPrice * quantityBought;
    const profit = totalSellPrice - totalBuyPrice;
    const roi = totalBuyPrice > 0 ? (profit / totalBuyPrice) * 100 : 0;

    return {
      buyUnitPrice,
      sellUnitPrice,
      totalBuyPrice,
      totalSellPrice,
      profit,
      roi
    };
  }, [numbers, packs]);

  const handleNumberChange = (name: NumericFieldName, value: string) => {
    setNumbers((currentNumbers) => ({
      ...currentNumbers,
      [name]: value
    }));
  };

  const handlePackChange = (name: PackFieldName, value: PackType) => {
    setPacks((currentPacks) => ({
      ...currentPacks,
      [name]: value
    }));
  };

  const handleCreateTransaction = async (formData: FormData) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await createTransactionAction(formData);

      if (result?.success) {
        formRef.current?.reset();
        setSelectedItem(null);
        setFormResetKey((currentKey) => currentKey + 1);
        setNumbers({
          quantityBought: "1",
          buyPackPrice: "0",
          sellPackPrice: "0"
        });
        setPacks({
          buyPackType: "unit",
          sellPackType: "unit"
        });
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const profitToneClassName = getToneClassName(preview.profit);

  return (
    <form action={handleCreateTransaction} className="rounded-[1rem] border border-border bg-surface p-[0.9rem] shadow-soft" ref={formRef}>
      <input name="itemId" type="hidden" value={selectedItem?.id ?? ""} />
      <input name="itemIconUrl" type="hidden" value={selectedItem?.iconUrl ?? ""} />

      <div className="mb-[0.75rem] flex items-center justify-between">
        <div>
          <h2 className="text-[1rem] font-semibold">Nouvel achat</h2>
          <p className="mt-[0.15rem] text-[0.78rem] text-muted">Statut initial : en vente</p>
        </div>
        <KamasIcon className="h-[1.55rem] w-[1.55rem]" />
      </div>

      <div className="grid gap-[0.7rem] lg:grid-cols-2">
        <FormSection icon={<Package size="0.9rem" />} title="Item">
          <div className="grid items-end gap-[0.7rem] sm:grid-cols-[minmax(0,1fr)_7.5rem]">
            <ItemCombobox
              inputClassName="mt-[0.35rem] h-12 rounded-[0.65rem] py-0 pl-8 pr-[0.62rem] text-[0.95rem]"
              key={formResetKey}
              label="Nom de l'item"
              labelClassName={labelClassName}
              name="itemName"
              onQueryChange={(query) => {
                if (selectedItem && query !== selectedItem.name) {
                  setSelectedItem(null);
                }
              }}
              onSelect={setSelectedItem}
              placeholder="Ex: Rune Ga Pa"
              value={selectedItem}
            />
            <NumberField label="Quantite achetee" min="1" name="quantityBought" onChange={handleNumberChange} value={numbers.quantityBought} />
          </div>
        </FormSection>

        <div className="order-last lg:order-none">
          <FormSection icon={<ReceiptText size="0.9rem" />} title="Resume">
            <div className="grid gap-[0.45rem] sm:grid-cols-2">
              <SummaryRow label="Investi" value={<KamasValue value={preview.totalBuyPrice} />} />
              <SummaryRow label="Revente estimee" value={<KamasValue value={preview.totalSellPrice} />} />
              <SummaryRow label="Benefice" toneClassName={profitToneClassName} value={<KamasValue value={preview.profit} />} />
              <SummaryRow label="ROI" toneClassName={profitToneClassName} value={formatRoi(preview.roi)} />
            </div>
          </FormSection>
        </div>

        <FormSection icon={<ShoppingBag size="0.9rem" />} title="Achat">
          <div className="grid gap-[0.7rem] sm:grid-cols-2">
            <PackSelect label="Type de lot achat" name="buyPackType" onChange={handlePackChange} value={packs.buyPackType} />
            <NumberField label="Prix du lot achete" name="buyPackPrice" onChange={handleNumberChange} value={numbers.buyPackPrice} />
          </div>
          <UnitPreview value={preview.buyUnitPrice} />
        </FormSection>

        <FormSection icon={<TrendingUp size="0.9rem" />} title="Revente">
          <div className="grid gap-[0.7rem] sm:grid-cols-2">
            <PackSelect label="Type de lot revente" name="sellPackType" onChange={handlePackChange} value={packs.sellPackType} />
            <NumberField label="Prix de revente estime du lot" name="sellPackPrice" onChange={handleNumberChange} value={numbers.sellPackPrice} />
          </div>
          <UnitPreview value={preview.sellUnitPrice} />
        </FormSection>
      </div>

      <button
        className="mt-[0.75rem] flex w-full items-center justify-center gap-[0.5rem] rounded-[0.75rem] bg-primary p-[0.7rem] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        <Plus size="1.125rem" aria-hidden="true" />
        {isSubmitting ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
};
