"use client";

import { UserRound } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { createProfileAction, type ProfileActionState } from "@/app/actions/profile";

const initialState: ProfileActionState = {
  error: null
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      <UserRound size="1.125rem" />
      {pending ? "Création..." : "Créer mon profil"}
    </button>
  );
};

export const UsernameForm = () => {
  const [state, formAction] = useFormState(createProfileAction, initialState);

  return (
    <form action={formAction} className="rounded-lg border border-border bg-surface p-4 shadow-soft">
      <div>
        <p className="text-sm font-medium text-primary">Lyphus</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Choisir un pseudo</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Ce pseudo sera affiché dans ton compte. Tes transactions restent liées à ton utilisateur Supabase.
        </p>
      </div>

      <label className="mt-5 block">
        <span className="text-sm text-muted-foreground">Pseudo</span>
        <input
          autoComplete="nickname"
          className="mt-2 w-full rounded-md border border-border bg-surface-soft px-3 py-3 text-base outline-none focus:border-primary"
          maxLength={24}
          minLength={3}
          name="username"
          pattern="[a-zA-Z0-9_-]{3,24}"
          placeholder="ton_pseudo"
          required
          type="text"
        />
      </label>

      <SubmitButton />

      {state.error ? (
        <p className="mt-4 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
};
