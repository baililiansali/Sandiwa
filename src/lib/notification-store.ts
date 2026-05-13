// import { notifications as initialNotifications, type Notification } from "@/data/notifications";
// import { toast } from "sonner";

// const STORAGE_KEY = "sandiwa.notifications";

// // Load notifications from localStorage
// const loadNotifications = (): Notification[] => {
//   const stored = localStorage.getItem(STORAGE_KEY);
//   if (stored) {
//     return JSON.parse(stored);
//   }
//   return initialNotifications;
// };

// // Save notifications to localStorage
// const saveNotifications = (notifications: Notification[]) => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
// };

// let notifications: Notification[] = loadNotifications();
// let listeners: (() => void)[] = [];

// // Subscribe to changes
// export const subscribeToNotifications = (listener: () => void) => {
//   listeners.push(listener);
//   return () => {
//     listeners = listeners.filter(l => l !== listener);
//   };
// };

// const notifyListeners = () => {
//   listeners.forEach(listener => listener());
// };

// // Get all notifications
// export const getNotifications = (): Notification[] => {
//   return [...notifications];
// };

// // Get unread count
// export const getUnreadCount = (): number => {
//   return notifications.filter(n => n.unread).length;
// };

// // Add a new notification
// export const addNotification = (notification: Omit<Notification, "id" | "unread">) => {
//   const newNotification: Notification = {
//     ...notification,
//     id: Date.now().toString(),
//     unread: true,
//   };
//   notifications = [newNotification, ...notifications];
//   saveNotifications(notifications);
//   notifyListeners();
  
//   // Show toast notification
//   toast.info(notification.title, {
//     description: notification.body,
//     duration: 5000,
//   });
  
//   return newNotification;
// };

// // Mark a notification as read
// export const markAsRead = (id: string) => {
//   notifications = notifications.map(n => 
//     n.id === id ? { ...n, unread: false } : n
//   );
//   saveNotifications(notifications);
//   notifyListeners();
// };

// // Mark all notifications as read
// export const markAllAsRead = () => {
//   notifications = notifications.map(n => ({ ...n, unread: false }));
//   saveNotifications(notifications);
//   notifyListeners();
// };

// // Delete a notification
// export const deleteNotification = (id: string) => {
//   notifications = notifications.filter(n => n.id !== id);
//   saveNotifications(notifications);
//   notifyListeners();
// };

// // Delete all notifications
// export const deleteAllNotifications = () => {
//   notifications = [];
//   saveNotifications(notifications);
//   notifyListeners();
// };

// // Reset to initial notifications (for testing)
// export const resetNotifications = () => {
//   notifications = [...initialNotifications];
//   saveNotifications(notifications);
//   notifyListeners();
// };




















// src/lib/notification-store.ts
import { notifications as initialNotifications, type Notification } from "@/data/notifications";
import { toast } from "sonner";

const STORAGE_KEY = "sandiwa.notifications";

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Load notifications from localStorage (only in browser)
const loadNotifications = (): Notification[] => {
  if (!isBrowser) return initialNotifications;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return initialNotifications;
};

// Save notifications to localStorage (only in browser)
const saveNotifications = (notifications: Notification[]) => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

let notifications: Notification[] = loadNotifications();
let listeners: (() => void)[] = [];

// Subscribe to changes
export const subscribeToNotifications = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Get all notifications
export const getNotifications = (): Notification[] => {
  return [...notifications];
};

// Get unread count
export const getUnreadCount = (): number => {
  return notifications.filter(n => n.unread).length;
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, "id" | "unread">) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    unread: true,
  };
  notifications = [newNotification, ...notifications];
  saveNotifications(notifications);
  notifyListeners();
  
  // Show toast notification (only in browser)
  if (isBrowser) {
    toast.info(notification.title, {
      description: notification.body,
      duration: 5000,
    });
  }
  
  return newNotification;
};

// Mark a notification as read
export const markAsRead = (id: string) => {
  notifications = notifications.map(n => 
    n.id === id ? { ...n, unread: false } : n
  );
  saveNotifications(notifications);
  notifyListeners();
};

// Mark all notifications as read
export const markAllAsRead = () => {
  notifications = notifications.map(n => ({ ...n, unread: false }));
  saveNotifications(notifications);
  notifyListeners();
};

// Delete a notification
export const deleteNotification = (id: string) => {
  notifications = notifications.filter(n => n.id !== id);
  saveNotifications(notifications);
  notifyListeners();
};

// Delete all notifications
export const deleteAllNotifications = () => {
  notifications = [];
  saveNotifications(notifications);
  notifyListeners();
};

// Reset to initial notifications (for testing)
export const resetNotifications = () => {
  notifications = [...initialNotifications];
  saveNotifications(notifications);
  notifyListeners();
};