"use server";

import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export type ProfileActionState = {
  error: string | null;
};

const usernamePattern = /^[a-z0-9_-]{3,24}$/;

const normalizeUsername = (value: FormDataEntryValue | null) => {
  return typeof value === "string" ? value.trim().toLocaleLowerCase("fr-FR") : "";
};

export const createProfileAction = async (_previousState: ProfileActionState, formData: FormData): Promise<ProfileActionState> => {
  const { supabase, user, profile } = await requireAuthenticatedUser({ requireProfile: false });

  if (profile) {
    redirect("/");
  }

  const username = normalizeUsername(formData.get("username"));

  if (!usernamePattern.test(username)) {
    return {
      error: "Choisis un pseudo de 3 à 24 caractères avec lettres, chiffres, tirets ou underscores."
    };
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce pseudo est déjà pris." };
    }

    console.error("createProfileAction insert failed", error);
    return { error: "Impossible de créer le profil pour le moment." };
  }

  redirect("/");
};
