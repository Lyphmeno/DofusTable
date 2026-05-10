import { AppShell } from "@/components/app-shell/app-shell";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";
import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: {
    view?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  if (searchParams.view === "table") {
    redirect("/tableau");
  }

  if (searchParams.view === "add") {
    redirect("/ajouter");
  }

  const { profile } = await requireAuthenticatedUser();

  return <AppShell activeView="home" profile={profile} />;
}
