// src/components/AdminNav.tsx
import { Link } from "@tanstack/react-router";
import { Bell, LogOut, User, Settings, Shield, Users, BookOpen, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications as initialNotifications, type Notification } from "@/data/notifications";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const notifIcon = {
  course: BookOpen,
  mentor: Users,
  community: Users,
  event: Star,
};

export function AdminNav() {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifs.filter((n) => n.unread).length;
  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, unread: false })));
  
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("AD");

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Admin User";
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "admin@sandiwa.com";
    const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials") || "AD";
    
    setUserName(name);
    setUserEmail(email);
    setUserInitials(initials);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Admin Badge */}
      <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
        <Shield className="h-4 w-4 text-red-500" />
        <span className="text-xs font-medium text-red-500">Admin Panel</span>
      </div>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <button aria-label="Notifications" className="relative p-2 text-foreground/70 hover:text-foreground">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="font-semibold text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-red-500 hover:underline">Mark all read</button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifs.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</li>
            )}
            {notifs.map((n) => {
              const Icon = notifIcon[n.icon as keyof typeof notifIcon] || Bell;
              return (
                <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.unread ? "bg-red-500/5" : ""}`}>
                  <div className="h-8 w-8 shrink-0 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {n.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />}
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Account" className="ml-1 flex h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 items-center justify-center text-white text-sm font-semibold">
            {userInitials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>
              <p className="text-xs text-red-500 mt-1">Administrator</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Admin Profile & Settings */}
          <DropdownMenuItem asChild>
            <Link to="/admin/profile" className="cursor-pointer">
              <User className="h-4 w-4 mr-2" /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/settings" className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Logout */}
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}