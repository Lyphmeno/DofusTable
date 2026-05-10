"use client";

import { LockKeyhole, LogIn, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils/cn";

type AuthMode = "signin" | "signup";
type Notice = {
  tone: "success" | "error";
  text: string;
};

const usernamePattern = /^[a-z0-9_-]{3,24}$/;

const normalizeUsername = (value: string) => value.trim().toLocaleLowerCase("fr-FR");

const getAuthErrorMessage = (message: string) => {
  const normalized = message.toLocaleLowerCase("fr-FR");

  if (normalized.includes("email not confirmed") || normalized.includes("not confirmed")) {
    return "Email non confirmé. Vérifie ta boîte mail avant de te connecter.";
  }

  if (normalized.includes("rate limit") || normalized.includes("rate exceeded") || normalized.includes("email rate limit")) {
    return "Limite d'envoi email Supabase atteinte. Réessaie plus tard ou configure un SMTP personnalisé.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }

  if (normalized.includes("already registered") || normalized.includes("already been registered") || normalized.includes("user already")) {
    return "Cet email est déjà utilisé.";
  }

  if (normalized.includes("password")) {
    return "Le mot de passe doit respecter les règles de sécurité Supabase.";
  }

  if (normalized.includes("database")) {
    return "Impossible de créer le profil. Le pseudo est peut-être déjà utilisé.";
  }

  return message || "Impossible de traiter la demande.";
};

export const LoginForm = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const isSignup = mode === "signup";

  const resetFormFeedback = (nextMode: AuthMode) => {
    setMode(nextMode);
    setNotice(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignIn = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setNotice({ tone: "error", text: getAuthErrorMessage(error.message) });
      return;
    }

    window.location.href = "/";
  };

  const handleSignUp = async () => {
    const supabase = createSupabaseBrowserClient();
    const normalizedUsername = normalizeUsername(username);

    if (!usernamePattern.test(normalizedUsername)) {
      setNotice({ tone: "error", text: "Choisis un pseudo de 3 à 24 caractères avec lettres, chiffres, tirets ou underscores." });
      return;
    }

    if (password.length < 6) {
      setNotice({ tone: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({ tone: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    const { data: isUsernameAvailable, error: availabilityError } = await supabase.rpc("is_username_available", {
      candidate: normalizedUsername
    });

    if (availabilityError) {
      setNotice({ tone: "error", text: "Impossible de vérifier le pseudo pour le moment." });
      return;
    }

    if (!isUsernameAvailable) {
      setNotice({ tone: "error", text: "Ce pseudo est déjà utilisé." });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: normalizedUsername
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setNotice({ tone: "error", text: getAuthErrorMessage(error.message) });
      return;
    }

    if (data.user?.identities?.length === 0) {
      setNotice({ tone: "error", text: "Cet email est déjà utilisé." });
      return;
    }

    await supabase.auth.signOut();
    setNotice({ tone: "success", text: "Compte créé. Vérifie ton email pour confirmer ton compte." });
    setMode("signin");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    if (isSignup) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }

    setIsSubmitting(false);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setNotice({ tone: "error", text: "Entre ton email avant de demander un nouveau mot de passe." });
      return;
    }

    setIsResettingPassword(true);
    setNotice(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });

    setIsResettingPassword(false);

    if (error) {
      setNotice({ tone: "error", text: getAuthErrorMessage(error.message) });
      return;
    }

    setNotice({ tone: "success", text: "Email de réinitialisation envoyé. Ouvre le lien pour choisir un mot de passe." });
  };

  return (
    <form className="rounded-lg border border-border bg-surface p-4 shadow-soft" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-medium text-primary">Lyphus</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {isSignup
            ? "Crée ton compte avec Supabase Auth et choisis ton pseudo."
            : "Connecte-toi avec ton email et ton mot de passe."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface-soft p-1">
        <button
          className={cn(
            "rounded-[0.45rem] px-3 py-2 text-sm font-medium transition",
            !isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => resetFormFeedback("signin")}
          type="button"
        >
          Connexion
        </button>
        <button
          className={cn(
            "rounded-[0.45rem] px-3 py-2 text-sm font-medium transition",
            isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => resetFormFeedback("signup")}
          type="button"
        >
          Inscription
        </button>
      </div>

      {isSignup ? (
        <label className="mt-5 block">
          <span className="text-sm text-muted-foreground">Pseudo</span>
          <span className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-soft px-3 py-3 focus-within:border-primary">
            <UserRound className="h-4 w-4 text-muted" />
            <input
              autoComplete="nickname"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base outline-none"
              maxLength={24}
              minLength={3}
              onChange={(event) => setUsername(event.target.value)}
              pattern="[a-zA-Z0-9_-]{3,24}"
              placeholder="ton_pseudo"
              required
              type="text"
              value={username}
            />
          </span>
        </label>
      ) : null}

      <label className={cn("block", isSignup ? "mt-4" : "mt-5")}>
        <span className="text-sm text-muted-foreground">Email</span>
        <span className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-soft px-3 py-3 focus-within:border-primary">
          <Mail className="h-4 w-4 text-muted" />
          <input
            autoComplete="email"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base outline-none"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ton.email@example.com"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-muted-foreground">Mot de passe</span>
        <span className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-soft px-3 py-3 focus-within:border-primary">
          <LockKeyhole className="h-4 w-4 text-muted" />
          <input
            autoComplete={isSignup ? "new-password" : "current-password"}
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

      {isSignup ? (
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
      ) : null}

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSignup ? <UserRound size="1.125rem" /> : <LogIn size="1.125rem" />}
        {isSubmitting ? "Chargement..." : isSignup ? "Créer un compte" : "Se connecter"}
      </button>

      {!isSignup ? (
        <button
          className="mt-3 w-full text-center text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isResettingPassword}
          onClick={handleResetPassword}
          type="button"
        >
          {isResettingPassword ? "Envoi..." : "Mot de passe oublié ?"}
        </button>
      ) : null}

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
