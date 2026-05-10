"use client";

import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils/cn";

type Notice = {
  tone: "success" | "error";
  text: string;
};

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (password.length < 6) {
      setNotice({ tone: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({ tone: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      setNotice({ tone: "error", text: "Le lien n'est plus valide. Redemande un email de réinitialisation." });
      return;
    }

    setNotice({ tone: "success", text: "Mot de passe mis à jour. Tu peux te connecter." });
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <form className="rounded-lg border border-border bg-surface p-4 shadow-soft" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-medium text-primary">Lyphus</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Choisis un mot de passe pour ton compte.
        </p>
      </div>

      <label className="mt-5 block">
        <span className="text-sm text-muted-foreground">Mot de passe</span>
        <span className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-soft px-3 py-3 focus-within:border-primary">
          <LockKeyhole className="h-4 w-4 text-muted" />
          <input
            autoComplete="new-password"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base outline-none"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
        </span>
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-muted-foreground">Confirmer le mot de passe</span>
        <span className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-soft px-3 py-3 focus-within:border-primary">
          <LockKeyhole className="h-4 w-4 text-muted" />
          <input
            autoComplete="new-password"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base outline-none"
            minLength={6}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={confirmPassword}
          />
        </span>
      </label>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <LockKeyhole size="1.125rem" />
        {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
      </button>

      {notice ? (
        <p
          className={cn(
            "mt-4 rounded-md border p-3 text-sm",
            notice.tone === "success" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"
          )}
        >
          {notice.text}
        </p>
      ) : null}
    </form>
  );
};
