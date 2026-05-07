import { Plus } from "lucide-react";
import { createTransactionAction } from "@/app/actions/transactions";
import { KamasIcon } from "@/components/ui/kamas-icon";

export const TransactionForm = () => {
  return (
    <form action={createTransactionAction} className="rounded-lg border border-line bg-panel p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Nouvel achat</h2>
          <p className="mt-1 text-sm text-slate-400">Statut initial : en vente</p>
        </div>
        <KamasIcon className="h-8 w-8" />
      </div>

      <label className="mt-3 block">
        <span className="text-sm text-slate-300">Item</span>
        <input
          className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 text-base outline-none focus:border-mint"
          required
          name="itemName"
          placeholder="Ex: Rune Ga Pa"
          type="text"
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Quantite achetee</span>
          <input className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 outline-none focus:border-mint" defaultValue="1" min="0" name="quantityBought" required type="number" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Pack achat</span>
          <select className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 outline-none focus:border-mint" name="buyPackType">
            <option value="unit">Unite</option>
            <option value="ten">Lot de 10</option>
            <option value="hundred">Lot de 100</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Prix achat</span>
          <input className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 outline-none focus:border-mint" defaultValue="0" min="0" name="buyPackPrice" required type="number" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Pack vente</span>
          <select className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 outline-none focus:border-mint" name="sellPackType">
            <option value="unit">Unite</option>
            <option value="ten">Lot de 10</option>
            <option value="hundred">Lot de 100</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-sm text-slate-300">Prix vente estime</span>
        <input className="mt-2 w-full rounded-md border border-line bg-panelSoft px-3 py-3 outline-none focus:border-mint" defaultValue="0" min="0" name="sellPackPrice" required type="number" />
      </label>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 font-semibold text-ink" type="submit">
        <Plus size="1.125rem" />
        Ajouter
      </button>
    </form>
  );
};
