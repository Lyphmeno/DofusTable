import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAllowedUser } from "@/lib/auth/require-allowed-user";
import { getTransactions } from "@/lib/transactions/queries";

export default async function TableauPage() {
  const { supabase } = await requireAllowedUser();
  const transactions = await getTransactions(supabase);

  return <DashboardShell activeView="table" transactions={transactions} />;
}
