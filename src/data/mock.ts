import mariaImg from "@/assets/mentor-maria.jpg";
import sarahImg from "@/assets/mentor-sarah.jpg";
import joseImg from "@/assets/mentor-jose.jpg";
import anaImg from "@/assets/mentor-ana.jpg";
import ramonImg from "@/assets/mentor-ramon.jpg";
import litaImg from "@/assets/mentor-lita.jpg";
import courseFilipino from "@/assets/course-filipino.jpg";
import courseHistory from "@/assets/course-history.jpg";
import courseArts from "@/assets/course-arts.jpg";
import eventTagalog from "@/assets/event-tagalog.jpg";

export type Mentor = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  rating: number;
  students: string;
  courses: number;
  tags: string[];
};

export type Course = {
  id: string;
  title: string;
  mentorId: string;
  mentor: string;
  image: string;
  badge?: "Bestseller" | "Popular" | "New";
  rating: number;
  enrolled: number;
  hours: number;
  price: number;
  category: string;
  description: string;
  outcomes: string[];
  lessons: { title: string; minutes: number }[];
};

export type Discussion = {
  id: string;
  category: string;
  title: string;
  body: string;
  author: string;
  hoursAgo: number;
  replies: number;
  likes: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
};

export const mentors: Mentor[] = [
  {
    id: "maria-santos",
    name: "Maria Santos",
    title: "Filipino Language Expert",
    image: mariaImg,
    bio: "Maria Santos is a native Filipino speaker and certified language tutor with over 10 years of teaching experience. She holds a degree in Linguistics from UP Diliman and has taught Filipino to thousands of learners worldwide. Her teaching style emphasizes practical conversation skills and cultural context.",
    rating: 4.9,
    students: "12k",
    courses: 12,
    tags: ["Filipino Language", "Conversational Skills", "Grammar"],
  },
  {
    id: "sarah-reyes",
    name: "Sarah Reyes",
    title: "Cultural Historian",
    image: sarahImg,
    bio: "Dr. Sarah Reyes holds a PhD in Philippine Studies from the University of the Philippines Diliman. She has spent over 15 years documenting oral histories and cultural practices across the archipelago. Her work focuses on preserving indigenous knowledge and making it accessible to modern learners.",
    rating: 4.7,
    students: "13k",
    courses: 12,
    tags: ["Cultural History", "Oral Traditions", "Community Stories"],
  },
  {
    id: "jose-reyes",
    name: "Jose Reyes",
    title: "History Professor",
    image: joseImg,
    bio: "Prof. Jose Reyes has been teaching Philippine History at Ateneo de Manila University for over 20 years. He is the author of several textbooks on Philippine history and has been featured in national documentaries about Philippine heritage sites.",
    rating: 4.8,
    students: "15k",
    courses: 8,
    tags: ["Philippine History", "Heritage Studies", "Colonial Period"],
  },
  {
    id: "ana-cruz",
    name: "Ana Cruz",
    title: "Traditional Arts Master",
    image: anaImg,
    bio: "Ana Cruz is an award-winning textile artist who has dedicated her career to preserving traditional Filipino weaving techniques. She learned T'nalak weaving from T'boli master weavers and now teaches these ancient skills to a new generation of artists and cultural enthusiasts.",
    rating: 4.7,
    students: "8k",
    courses: 6,
    tags: ["Weaving", "Textile Arts", "Pottery", "Woodcarving"],
  },
  {
    id: "ramon-villanueva",
    name: "Ramon Villanueva",
    title: "Music & Dance Instructor",
    image: ramonImg,
    bio: "Ramon Villanueva is a professional kulintang player and folk dance choreographer who has performed at international festivals. With 15 years of experience, he brings traditional Filipino music and dance to life through engaging, step-by-step instruction.",
    rating: 4.8,
    students: "8k",
    courses: 5,
    tags: ["Kulintang", "Rondalla", "Folk Dance", "Tinikling"],
  },
  {
    id: "lita-mendoza",
    name: "Lita Mendoza",
    title: "Filipino Chef & Culinary Expert",
    image: litaImg,
    bio: "Lita Mendoza is a veteran Filipino chef with over 30 years of experience. She has been featured in numerous culinary magazines and TV shows, and runs a popular restaurant in Manila. Her courses focus on authentic recipes passed down through generations.",
    rating: 4.9,
    students: "13k",
    courses: 7,
    tags: ["Filipino Cuisine", "Regional Cooking", "Desserts"],
  },
];

export const courses: Course[] = [
  {
    id: "filipino-beginners",
    title: "Complete Filipino Language for Beginners",
    mentorId: "maria-santos",
    mentor: "Maria Santos",
    image: courseFilipino,
    badge: "Bestseller",
    rating: 4.9,
    enrolled: 12500,
    hours: 40,
    price: 500,
    category: "Filipino Language",
    description:
      "Master the basics of Filipino (Tagalog) from native speakers. This comprehensive course covers everyday conversation, grammar, pronunciation, and cultural context to help you communicate confidently.",
    outcomes: [
      "Introduction to Filipino Language",
      "Basic Greetings & Politeness",
      "Numbers, Days, and Time",
      "Common Phrases for Daily Life",
      "Sentence Structure & Grammar Basics",
      "Food & Dining Vocabulary",
    ],
    lessons: [
      { title: "Introduction to Filipino Language", minutes: 15 },
      { title: "Greetings & Polite Expressions", minutes: 25 },
      { title: "Pronunciation Fundamentals", minutes: 30 },
      { title: "Numbers, Days, and Time", minutes: 35 },
      { title: "Building Simple Sentences", minutes: 40 },
      { title: "Common Daily Phrases", minutes: 45 },
      { title: "Food & Dining Vocabulary", minutes: 30 },
      { title: "Asking Questions", minutes: 35 },
      { title: "Cultural Context & Etiquette", minutes: 40 },
      { title: "Putting It All Together", minutes: 50 },
    ],
  },
  {
    id: "philippine-history",
    title: "Philippine History and Heritage Masterclass",
    mentorId: "jose-reyes",
    mentor: "Jose Reyes",
    image: courseHistory,
    badge: "Popular",
    rating: 4.8,
    enrolled: 8900,
    hours: 35,
    price: 880,
    category: "History",
    description:
      "From pre-colonial kingdoms to modern independence, journey through the rich tapestry of Philippine history with stories, documents, and visits to heritage sites.",
    outcomes: [
      "Pre-colonial Philippine societies",
      "Spanish colonial era",
      "American period and independence",
      "Modern Philippine identity",
    ],
    lessons: [
      { title: "Pre-colonial Philippines", minutes: 45 },
      { title: "Arrival of the Spanish", minutes: 50 },
      { title: "The Revolution of 1896", minutes: 55 },
      { title: "American Period", minutes: 50 },
      { title: "World War II in the Philippines", minutes: 60 },
      { title: "Independence and Modern Era", minutes: 50 },
    ],
  },
  {
    id: "traditional-arts",
    title: "Traditional Filipino Arts and Crafts",
    mentorId: "ana-cruz",
    mentor: "Ana Cruz",
    image: courseArts,
    badge: "New",
    rating: 4.7,
    enrolled: 3200,
    hours: 28,
    price: 300,
    category: "Arts & Crafts",
    description:
      "Hands-on introduction to weaving, pottery, and woodcarving traditions of the Philippines. Learn techniques passed down for generations.",
    outcomes: [
      "T'nalak weaving basics",
      "Pottery shaping techniques",
      "Symbolism in Filipino crafts",
      "Setting up your own workspace",
    ],
    lessons: [
      { title: "Tools & Materials Overview", minutes: 25 },
      { title: "Weaving Patterns", minutes: 45 },
      { title: "Natural Dyes", minutes: 30 },
      { title: "Pottery Fundamentals", minutes: 50 },
      { title: "Woodcarving Basics", minutes: 40 },
    ],
  },
];

export const discussions: Discussion[] = [
  {
    id: "1",
    category: "Filipino Language",
    title: "Tips for mastering Tagalog pronunciation?",
    body: "I keep struggling with the 'ng' sound. What helped you when you started learning?",
    author: "Ana Mercado",
    hoursAgo: 2,
    replies: 24,
    likes: 56,
  },
  {
    id: "2",
    category: "Heritage",
    title: "Best heritage sites to visit in Cebu?",
    body: "Planning a trip next month. Looking for must-visit cultural and historical landmarks.",
    author: "Marco Dela Cruz",
    hoursAgo: 5,
    replies: 18,
    likes: 42,
  },
  {
    id: "3",
    category: "Cuisine",
    title: "Authentic adobo recipe variations?",
    body: "What regional variations have you tried? My lola's version uses coconut milk.",
    author: "Joana Lim",
    hoursAgo: 8,
    replies: 31,
    likes: 78,
  },
  {
    id: "4",
    category: "Music & Dance",
    title: "Learning Tinikling as an adult — possible?",
    body: "Started lessons last week. Feet keep getting in the way! Any tips?",
    author: "Ben Aquino",
    hoursAgo: 12,
    replies: 14,
    likes: 33,
  },
];

export const events: EventItem[] = [
  {
    id: "tagalog-conversation-circle",
    title: "Tagalog Conversation Circle",
    date: "Apr 21, 2026",
    location: "University of the Philippines Diliman, Quezon City",
    image: eventTagalog,
    description:
      "Tagalog Conversation Circle will be an engaging and welcoming language workshop designed for learners who want to improve their Tagalog speaking skills in a supportive environment at the University of the Philippines Diliman, Quezon City. Attendees will participate in guided conversations, interactive speaking activities, pronunciation practice, and confidence-building exercises focused on real-life communication. Connect with fellow learners, expand your vocabulary, and experience the joy of speaking Tagalog through meaningful conversations. Prepare for a fun and enriching language-learning experience!",
  },
];
