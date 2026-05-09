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
      className="rounded-md border border-border bg-surface p-1.5 text-muted-foreground md:p-2"
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" />
    </button>
  );
};
