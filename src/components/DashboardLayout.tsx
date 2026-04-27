import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Heart, 
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },  
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Users, label: "Mentors", href: "/mentors" },
  { icon: Heart, label: "Community", href: "/community" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userInitials, setUserInitials] = useState("JR");

  useEffect(() => {
    const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials");
    if (initials) {
      setUserInitials(initials);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-background transition-transform",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border px-4">
              <Link to="/" className="flex items-center">
                <Logo />
              </Link>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-gold"
                  activeProps={{
                    className: "bg-gold/10 text-gold font-semibold",
                  }}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-border p-4 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-gold"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                Dark Mode
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className={cn("flex-1", isSidebarOpen ? "ml-64" : "ml-0")}>
          {/* Top Nav Bar */}
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 sm:px-6 lg:px-8 backdrop-blur">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Nav />
          </div>

          <main className="flex-1">{children}</main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

