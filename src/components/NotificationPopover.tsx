import { Link } from "@tanstack/react-router";
import { Bell, Eye, BookMarked, GraduationCap, MessageCircle, CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from "@/lib/notification-store";
import { type Notification } from "@/data/notifications";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const notifIcon = {
  course: BookMarked,
  mentor: GraduationCap,
  community: MessageCircle,
  event: CalendarDays,
};

export function NotificationPopover({ seeAllLink }: { seeAllLink: string }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifs = () => {
      setNotifs(getNotifications());
      setUnreadCount(getUnreadCount());
    };
    loadNotifs();
    
    const interval = setInterval(loadNotifs, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
    setNotifs(getNotifications());
    setUnreadCount(getUnreadCount());
    toast.success("Marked as read");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(id);
    setNotifs(getNotifications());
    setUnreadCount(getUnreadCount());
    toast.success("Notification deleted");
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setNotifs(getNotifications());
    setUnreadCount(getUnreadCount());
    toast.success("All notifications marked as read");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Notifications" className="relative p-2 text-foreground/70 hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-gold text-[10px] font-bold text-gold-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">Notifications</p>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-gold hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-96 overflow-y-auto divide-y divide-border">
          {notifs.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</li>
          )}
          {notifs.slice(0, 5).map((n) => {
            const Icon = notifIcon[n.icon];
            return (
              <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.unread ? "bg-gold/5" : ""}`}>
                <div className="h-8 w-8 shrink-0 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {n.unread && (
                    <button
                      onClick={(e) => handleMarkRead(n.id, e)}
                      className="text-[10px] text-gold hover:underline whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(n.id, e)}
                    className="text-[10px] text-red-500 hover:underline whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-border p-2">
          <Link
            to={seeAllLink}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-gold hover:bg-gold/10 rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}