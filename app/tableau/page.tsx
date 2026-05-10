import { AppShell } from "@/components/app-shell/app-shell";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";
import { getTransactions } from "@/lib/transactions/queries";

export default async function TableauPage() {
  const { supabase, user, profile } = await requireAuthenticatedUser();
  const transactions = await getTransactions(supabase, user.id);

  return <AppShell activeView="table" profile={profile} transactions={transactions} />;
}
