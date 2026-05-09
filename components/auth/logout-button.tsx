"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils/cn";

type LogoutButtonProps = {
  className?: string;
  showLabel?: boolean;
};

export const LogoutButton = ({ className, showLabel = false }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      aria-label="Se déconnecter"
      className={cn(
        "inline-flex items-center justify-center gap-[0.45rem] rounded-md border border-border bg-surface p-1.5 text-muted-foreground transition hover:border-primary hover:text-foreground md:p-2",
        showLabel && "px-3 text-[0.8125rem] font-medium",
        className
      )}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" />
      {showLabel ? <span>Se déconnecter</span> : null}
    </button>
  );
};
