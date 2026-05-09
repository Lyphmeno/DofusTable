import { AppShell } from "@/components/app-shell/app-shell";
import { requireAllowedUser } from "@/lib/auth/require-allowed-user";
import { getTransactions } from "@/lib/transactions/queries";

export default async function TableauPage() {
  const { supabase } = await requireAllowedUser();
  const transactions = await getTransactions(supabase);

  return <AppShell activeView="table" transactions={transactions} />;
}
