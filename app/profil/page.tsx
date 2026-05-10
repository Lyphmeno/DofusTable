import { redirect } from "next/navigation";
import { UsernameForm } from "@/components/auth/username-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export default async function ProfilPage() {
  const { profile } = await requireAuthenticatedUser({ requireProfile: false });

  if (profile) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-6">
      <UsernameForm />
    </main>
  );
}
