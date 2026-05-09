import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAllowedUser } from "@/lib/auth/require-allowed-user";
import { getTransactions } from "@/lib/transactions/queries";

export default async function AjouterPage() {
  const { supabase } = await requireAllowedUser();
  const transactions = await getTransactions(supabase);

  return <DashboardShell activeView="add" transactions={transactions} />;
}
