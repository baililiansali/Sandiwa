import { addDays } from "date-fns";

export interface Event {
  id: string;
  title: string;
  date: Date;
  dateTo?: Date; // Add end date for multi-day events
  location: string;
  description: string;
  image?: string;
  category: "workshop" | "meetup" | "celebration" | "conversation";
  isVirtual?: boolean;
  price?: number;
  capacity?: number;
  registered?: number;
  mentorId?: string;
  mentorName?: string;
}

export const events: Event[] = [
  {
    id: "event-tagalog-circle",
    title: "Tagalog Conversation Circle",
    date: addDays(new Date(), 5),
    location: "University of the Philippines Diliman, Quezon City",
    description:
      "Tagalog Conversation Circle will be an engaging and welcoming language workshop designed for learners who want to improve their Tagalog speaking skills in a supportive environment at the University of the Philippines Diliman, Quezon City. Attendees will participate in guided conversations, interactive speaking activities, pronunciation practice, and confidence-building exercises focused on real-life communication. Connect with fellow learners, expand your vocabulary, and experience the joy of speaking Tagalog through meaningful conversations. Prepare for a fun and enriching language-learning experience!",
    category: "conversation",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    price: 0,
    capacity: 30,
    registered: 18,
    mentorId: "mentor_001",
    mentorName: "Maria Santos",
  },
  {
    id: "event-kundiman-workshop",
    title: "Kundiman Song Interpretation",
    date: addDays(new Date(), 12),
    location: "Cultural Center of the Philippines, Pasay",
    description:
      "Learn the art of singing and interpreting Kundiman, the traditional Filipino love song. This workshop covers vocal techniques, emotional expression, and historical context.",
    category: "workshop",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=400&fit=crop",
    price: 350,
    capacity: 25,
    registered: 12,
    mentorId: "mentor_002",
    mentorName: "Reynaldo Cruz",
  },
  {
    id: "event-heritage-walk",
    title: "Intramuros Heritage Walk",
    date: addDays(new Date(), 8),
    location: "Intramuros, Manila",
    description:
      "Join us for a guided walking tour through the historic walls of Intramuros. Discover centuries-old churches, plazas, and stories from the Spanish colonial era.",
    category: "meetup",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&h=400&fit=crop",
    price: 200,
    capacity: 40,
    registered: 28,
    mentorId: "mentor_003",
    mentorName: "Tessie Rivera",
  },
  {
    id: "event-online-tagalog",
    title: "Online Tagalog Pronunciation Lab",
    date: addDays(new Date(), 15),
    location: "Zoom",
    description:
      "Virtual intensive session focusing on the tricky sounds of Tagalog: 'ng', 'mga', and glottal stops. Perfect for remote learners.",
    category: "workshop",
    isVirtual: true,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=400&fit=crop",
    price: 150,
    capacity: 50,
    registered: 34,
    mentorId: "mentor_001",
    mentorName: "Maria Santos",
  },
  {
    id: "event-filipino-food-fest",
    title: "Filipino Food Festival",
    date: addDays(new Date(), 10),
    dateTo: addDays(new Date(), 12), // 3-day event
    location: "SM Megamall, Mandaluyong",
    description:
      "A 3-day celebration of Filipino cuisine featuring cooking demos, food tasting, and cultural performances. Experience the rich flavors of the Philippines!",
    category: "celebration",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=400&fit=crop",
    price: 500,
    capacity: 200,
    registered: 145,
    mentorId: "mentor_002",
    mentorName: "Reynaldo Cruz",
  },
];

export const formatEventDate = (date: Date, dateTo?: Date): string => {
  if (dateTo) {
    const startMonth = date.toLocaleDateString("en-US", { month: "short" });
    const startDay = date.getDate();
    const endMonth = dateTo.toLocaleDateString("en-US", { month: "short" });
    const endDay = dateTo.getDate();
    const year = date.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};