import { AppShell } from "@/components/app-shell/app-shell";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export default async function ParametresPage() {
  const { profile } = await requireAuthenticatedUser();

  return <AppShell activeView="settings" profile={profile} />;
}
