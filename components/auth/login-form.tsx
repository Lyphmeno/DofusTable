"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  error?: string;
};

export const LoginForm = ({ error }: LoginFormProps) => {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ALLOWED_EMAIL ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    setIsSubmitting(false);

    if (signInError) {
      setMessage(signInError.message);
      return;
    }

    setMessage("Lien envoye. Ouvre ton email pour te connecter.");
  };

  return (
    <form className="rounded-lg border border-border bg-surface p-4 shadow-soft" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-medium text-primary">DofusTable</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Connexion privee</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Entre ton email autorise pour recevoir un lien de connexion.
        </p>
      </div>

      <label className="mt-5 block">
        <span className="text-sm text-muted-foreground">Email</span>
        <input
          autoComplete="email"
          className="mt-2 w-full rounded-md border border-border bg-surface-soft px-3 py-3 text-base outline-none focus:border-mint"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ton.email@example.com"
          type="email"
          value={email}
        />
      </label>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <Mail size="1.125rem" />
        {isSubmitting ? "Envoi..." : "Recevoir le lien"}
      </button>

      {error === "unauthorized" ? (
        <p className="mt-4 rounded-md border border-coral/40 bg-coral/10 p-3 text-sm text-danger">
          Cet email n'est pas autorise pour cette application.
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-md border border-border bg-surface-soft p-3 text-sm text-slate-200">{message}</p>
      ) : null}
    </form>
  );
};
