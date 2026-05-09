import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const requireAllowedUser = async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const { data: allowedUser } = await supabase
    .from("allowed_users")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!allowedUser) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  return { supabase, user };
};
