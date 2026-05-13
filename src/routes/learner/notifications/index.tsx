import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, subscribeToNotifications } from "@/lib/notification-store";
import { type Notification } from "@/data/notifications";
import { Bell, BookOpen, Users, MessageCircle, Calendar, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/learner/notifications/")({
  head: () => ({
    meta: [
      { title: "Notifications — Sandiwa" },
      { name: "description", content: "View all your notifications and updates." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifs = () => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    };
    
    loadNotifs();
    
    const unsubscribe = subscribeToNotifications(() => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    });
    
    return () => unsubscribe();
  }, []);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "course":
        return <BookOpen className="h-5 w-5" />;
      case "mentor":
        return <Users className="h-5 w-5" />;
      case "community":
        return <MessageCircle className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success("Marked as read");
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast.success("Notification deleted");
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all notifications?")) {
      deleteAllNotifications();
      toast.success("All notifications deleted");
    }
  };

  return (
    <AuthGuard>
      <SiteLayout>
        <div className="bg-cream min-h-screen">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl font-bold text-navy">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gold text-white">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-gold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={handleDeleteAll}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete all
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-border bg-card">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications yet</p>
                <Link to="/learner/dashboard" className="text-gold hover:underline text-sm mt-2 inline-block">
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl border border-border bg-card p-5 transition-all ${
                      notification.unread ? "border-l-4 border-l-gold bg-gold/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.unread ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      }`}>
                        {getIcon(notification.icon)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <h3 className={`font-semibold ${notification.unread ? "text-navy" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
                            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                          </div>
                          <div className="flex gap-2">
                            {notification.unread && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-gold hover:underline"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Unread dot */}
                      {notification.unread && (
                        <div className="h-2 w-2 rounded-full bg-gold flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    </AuthGuard>
  );
}