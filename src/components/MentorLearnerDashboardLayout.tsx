import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { MentorLearnerNav } from "./MentorLearnerNav";
import { Footer } from "./Footer";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DollarSign, 
  LogOut,
  Sun,
  Moon,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  Calendar,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/mentor/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/mentor/courses" },
  { icon: Users, label: "My Students", href: "/mentor/students" },
  { icon: BookOpen, label: "Encyclopedia", href: "/mentor/encyclopedia" },
  { icon: DollarSign, label: "Earnings", href: "/mentor/earnings" },
  { 
    icon: Heart, 
    label: "Community", 
    href: "/mentor/community/",
    hasDropdown: true,
    dropdownItems: [
      { icon: Heart, label: "Community Home", href: "/mentor/community/" },
      { icon: MessageCircle, label: "Discussions", href: "/mentor/community/discussions/" },
      { icon: Calendar, label: "Events", href: "/mentor/community/events/" }
    ]
  },
  { 
    icon: BarChart3, 
    label: "Analytics", 
    href: "/mentor/analytics",
    submenu: [
      { icon: TrendingUp, label: "Overview", href: "/mentor/analytics" },
      { icon: Activity, label: "Student Engagement", href: "/mentor/analytics/engagement" },
      { icon: Award, label: "Completion Rates", href: "/mentor/analytics/completion" },
      { icon: BarChart3, label: "Top Courses", href: "/mentor/analytics/courses" },
    ]
  },
  { icon: Bell, label: "Notifications", href: "/mentor/notifications" },
];

export function MentorLearnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [userName, setUserName] = useState("Mentor");
  const [userInitials, setUserInitials] = useState("M");

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Mentor User";
    const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials") || "MU";
    setUserName(name);
    setUserInitials(initials);
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    const currentPath = router.state.location.pathname;
    if (currentPath.startsWith("/mentor/analytics")) {
      setOpenSubmenu("Analytics");
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

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const isSubmenuActive = (submenuItems: { href: string }[]) => {
    return submenuItems.some(item => router.state.location.pathname === item.href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-background transition-transform duration-300 overflow-y-auto",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4 sticky top-0 bg-background z-10">
              <Link to="/" className="flex items-center">
                <Logo />
              </Link>
              <button
                onClick={toggleSidebar}
                className="rounded-md p-1.5 hover:bg-accent lg:hidden"
                aria-label="Close sidebar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 px-2 py-4">
              {sidebarLinks.map((link) => (
                <div key={link.label}>
                  {link.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(link.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-gold",
                          isSubmenuActive(link.submenu) && "bg-gold/10 text-gold font-semibold"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </div>
                        {openSubmenu === link.label ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {openSubmenu === link.label && (
                        <div className="ml-6 mt-1 space-y-1">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-gold"
                              activeProps={{
                                className: "bg-gold/10 text-gold font-semibold",
                              }}
                            >
                              <sub.icon className="h-4 w-4" />
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-gold"
                        )}
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
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 sm:px-6 lg:px-8 backdrop-blur">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 hover:bg-accent transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <MentorLearnerNav />
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