"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const isAuthPage = pathname.startsWith("/auth");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthPage || !user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar userName={user.name} onLogout={logout} />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
