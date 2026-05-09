import { LogoutButton } from "@/components/auth/logout-button";

export const SettingsView = () => {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-[0.6rem] md:gap-[0.75rem]">
      <section className="grid gap-[0.45rem] md:gap-[0.6rem]">
        <h2 className="text-[0.82rem] font-semibold uppercase tracking-normal text-muted-foreground md:text-sm">
          Compte
        </h2>

        <div className="rounded-[0.75rem] border border-border bg-surface p-[0.75rem] md:rounded-[1rem] md:p-[1rem]">
          <LogoutButton className="min-h-10 w-full bg-surface-soft md:w-auto" showLabel />
        </div>
      </section>
    </div>
  );
};
