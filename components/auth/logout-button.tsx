"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      aria-label="Se deconnecter"
      className="rounded-md border border-border bg-surface p-2 text-muted-foreground"
      onClick={handleLogout}
      type="button"
    >
      <LogOut size="1.125rem" />
    </button>
  );
};
