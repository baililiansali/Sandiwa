export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: "course" | "mentor" | "community" | "event";
};

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "New lesson available",
    body: "Maria Santos posted 'Pronunciation Fundamentals' in Filipino for Beginners.",
    time: "2h ago",
    unread: true,
    icon: "course",
  },
  {
    id: "n2",
    title: "Reply to your discussion",
    body: "Marco Dela Cruz replied to 'Tips for mastering Tagalog pronunciation?'",
    time: "5h ago",
    unread: true,
    icon: "community",
  },
  {
    id: "n3",
    title: "Event reminder",
    body: "Tagalog Conversation Circle starts in 3 days.",
    time: "1d ago",
    unread: true,
    icon: "event",
  },
  {
    id: "n4",
    title: "Welcome to Sandiwa!",
    body: "Complete your profile to get personalised recommendations.",
    time: "3d ago",
    unread: false,
    icon: "mentor",
  },
];
