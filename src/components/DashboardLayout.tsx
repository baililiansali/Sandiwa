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
  Moon,
  Bell,
  Bookmark,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/learner/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/learner/courses/courses" },
  { icon: Users, label: "Mentors", href: "/learner/mentors/mentors" },
  { icon: BookOpen, label: "Encyclopedia", href: "/learner/encyclopedia" },
  { 
    icon: Heart, 
    label: "Community", 
    href: "/learner/community/",
    hasDropdown: true,
    dropdownItems: [
      { icon: Heart, label: "Community", href: "/learner/community/" },
      { icon: MessageCircle, label: "Discussion", href: "/learner/community/discussions/" },
      { icon: Calendar, label: "Event", href: "/learner/community/events/" }
    ]
  },
  { icon: Bell, label: "Notifications", href: "/learner/notifications" },
  { icon: Bookmark, label: "Saved", href: "/learner/saved" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userInitials, setUserInitials] = useState("JR");
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

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

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
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

            <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
              {sidebarLinks.map((link) => (
                <div key={link.label}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-gold"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </div>
                        {openDropdowns.includes(link.label) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {openDropdowns.includes(link.label) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {link.dropdownItems?.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-gold"
                              activeProps={{
                                className: "bg-gold/10 text-gold font-semibold",
                              }}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-gold"
                      activeProps={{
                        className: "bg-gold/10 text-gold font-semibold",
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