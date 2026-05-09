import { AppShell } from "@/components/app-shell/app-shell";
import { requireAllowedUser } from "@/lib/auth/require-allowed-user";
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

  await requireAllowedUser();

  return <AppShell activeView="home" />;
}
