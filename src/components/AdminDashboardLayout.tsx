// src/components/AdminDashboardLayout.tsx
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { AdminNav} from "./AdminNav"
import { Footer } from "./Footer";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Star, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  UserCheck,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { 
    icon: Users, 
    label: "User Management", 
    href: "/admin/users",
    hasDropdown: true,
    dropdownItems: [
      { icon: Users, label: "Users", href: "/admin/users" },
      { icon: UserCheck, label: "Mentor Applications", href: "/admin/mentors" }
    ]
  },
  { icon: BookOpen, label: "Course Management", href: "/admin/courses" },
  { icon: BookOpen, label: "Payment Management", href: "/admin/payments" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
];

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-background transition-transform duration-300",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link to="/" className="flex items-center">
                <Logo />
              </Link>
              <button
                onClick={toggleSidebar}
                className="rounded-md p-1.5 hover:bg-accent lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 px-2 py-4 overflow-y-auto">
              {sidebarLinks.map((link) => (
                <div key={link.href}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-red-500",
                          openDropdowns[link.label] && "bg-accent/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </div>
                        {openDropdowns[link.label] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {openDropdowns[link.label] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {link.dropdownItems?.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-red-500"
                              activeProps={{
                                className: "bg-red-500/10 text-red-500 font-semibold",
                              }}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-red-500"
                      activeProps={{
                        className: "bg-red-500/10 text-red-500 font-semibold",
                      }}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="border-t border-border p-4 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-red-500"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>Dark Mode</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className={cn("flex-1", isSidebarOpen ? "ml-64" : "ml-0")}>
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 sm:px-6 lg:px-8 backdrop-blur">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 hover:bg-accent transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <AdminNav />
          </div>

          <main className="min-h-[calc(100vh-4rem)] bg-muted/20">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}