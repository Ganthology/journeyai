import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavigationTabs } from "./_components/navigation-tabs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen container max-w-md mx-auto pt-4">
      <NavigationTabs />
      <div className="gap-y-4">{children}</div>
    </div>
  );
}
