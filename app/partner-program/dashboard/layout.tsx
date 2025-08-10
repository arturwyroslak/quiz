import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ClientSessionProvider } from '@/components/providers/session-provider';
import { DashboardClientLayout } from '@/components/dashboard/dashboard-client-layout';
import { MobileHeader } from '@/components/dashboard/mobile-header';
import { DashboardMain } from '@/components/dashboard/dashboard-main';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/partner-program/login");
  }

  return (
    <ClientSessionProvider session={session}>
      <DashboardClientLayout>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Sidebar />
          <div className="flex flex-col flex-1">
            <MobileHeader />
            <DashboardMain>
              {children}
            </DashboardMain>
          </div>
        </div>
      </DashboardClientLayout>
    </ClientSessionProvider>
  );
}