import { Header } from "./Header";
import { DashboardLayout } from "./DashboardLayout";
import { Footer } from "./Footer";
import { useLocation } from "@tanstack/react-router";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Only use Header on landing page
  const isLandingPage = location.pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // For authenticated pages (profile, courses, mentors, community)
  return <DashboardLayout>{children}</DashboardLayout>;
}