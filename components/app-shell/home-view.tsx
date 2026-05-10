import Link from "next/link";
import { ArrowRight, PlusCircle, Repeat2, Table2 } from "lucide-react";

export const HomeView = () => {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-[0.6rem] md:gap-[0.75rem]">
      <h2 className="text-center font-proclamate text-[2.8rem] font-medium leading-none text-primary md:hidden">Lyphus</h2>

      <section className="grid gap-[0.45rem] md:gap-[0.6rem]">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.82rem] font-semibold uppercase tracking-normal text-muted-foreground md:text-sm">Modules</h3>
        </div>

        <article className="group relative grid min-w-0 gap-[0.75rem] rounded-[0.75rem] border border-border bg-surface p-[0.75rem] shadow-soft transition hover:border-primary hover:bg-surface-soft md:grid-cols-[auto_1fr_auto] md:items-center md:rounded-[1rem] md:p-[1rem]">
          <Link aria-label="Ouvrir Achat/Revente" className="absolute inset-0 rounded-[inherit]" href="/tableau" />

          <span className="relative flex h-10 w-10 items-center justify-center rounded-[0.65rem] bg-primary/10 text-primary md:h-12 md:w-12">
            <Repeat2 className="h-5 w-5 md:h-6 md:w-6" />
          </span>

          <span className="relative min-w-0">
            <span className="block text-[1rem] font-semibold text-foreground md:text-[1.15rem]">Achat/Revente</span>
            <span className="mt-1 block max-w-2xl text-[0.78rem] leading-5 text-muted-foreground md:text-sm md:leading-6">
              Suis tes achats, tes mises en vente, tes taxes HDV, tes bénéfices réels et tes invendus.
            </span>
          </span>

          <span className="relative z-10 flex min-w-0 flex-wrap gap-[0.4rem] md:justify-end">
            <Link className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-soft px-2 py-1 text-[0.72rem] font-medium text-muted-foreground transition hover:border-primary hover:text-foreground md:text-xs" href="/ajouter">
              <PlusCircle className="h-3.5 w-3.5" />
              Ajouter
            </Link>
            <Link className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-soft px-2 py-1 text-[0.72rem] font-medium text-muted-foreground transition hover:border-primary hover:text-foreground md:text-xs" href="/tableau">
              <Table2 className="h-3.5 w-3.5" />
              Tableau
            </Link>
          </span>
        </article>
      </section>
    </div>
  );
};
