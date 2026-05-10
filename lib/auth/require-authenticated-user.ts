import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProfileRow, type ProfileRow } from "@/lib/types/profile";

type RequireAuthenticatedUserOptions = {
  requireProfile?: boolean;
};

export const requireAuthenticatedUser = async (options: RequireAuthenticatedUserOptions = {}) => {
  const { requireProfile = true } = options;
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRow ? mapProfileRow(profileRow as ProfileRow) : null;

  if (requireProfile && !profile) {
    redirect("/profil");
  }

  return { supabase, user, profile };
};
