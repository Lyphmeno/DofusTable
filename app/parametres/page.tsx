import { AppShell } from "@/components/app-shell/app-shell";
import { requireAllowedUser } from "@/lib/auth/require-allowed-user";

export default async function ParametresPage() {
  await requireAllowedUser();

  return <AppShell activeView="settings" />;
}
