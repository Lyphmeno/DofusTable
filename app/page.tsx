import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapTransactionRow, type TransactionRow } from "@/lib/transactions/mappers";
import type { AppView } from "@/components/navigation/app-navigation";
import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: {
    view?: string;
  };
};

const getActiveView = (view?: string): AppView => {
  return view === "table" ? "table" : "add";
};

export default async function HomePage({ searchParams }: HomePageProps) {
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

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  const transactions = ((data ?? []) as TransactionRow[]).map(mapTransactionRow);

  return <DashboardShell activeView={getActiveView(searchParams.view)} transactions={transactions} />;
}
