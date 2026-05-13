// src/data/mockMentors.ts
import mariaImg from "@/assets/mentor-maria.jpg";
import sarahImg from "@/assets/mentor-sarah.jpg";
import joseImg from "@/assets/mentor-jose.jpg";
import anaImg from "@/assets/mentor-ana.jpg";
import ramonImg from "@/assets/mentor-ramon.jpg";
import litaImg from "@/assets/mentor-lita.jpg";

export type Mentor = {
  id: string;
  name: string;
  email: string;
  title: string;
  image: string;
  bio: string;
  rating: number;
  students: string;
  courses: number;
  tags: string[];
};

export const mentors: Mentor[] = [
  {
    id: "maria-santos",
    name: "Maria Santos",
    email: "mentor.maria@gmail.com",
    title: "Filipino Language Expert",
    image: mariaImg,
    bio: "Maria Santos is a native Filipino speaker and certified language tutor with over 10 years of teaching experience. She holds a degree in Linguistics from UP Diliman and has taught Filipino to thousands of learners worldwide. Her teaching style emphasizes practical conversation skills and cultural context.",
    rating: 4.9,
    students: "15k",
    courses: 3,
    tags: ["Filipino Language", "Conversational Skills", "Grammar"],
  },
  {
    id: "sarah-reyes",
    name: "Sarah Reyes",
    email: "mentor.reyes@gmail.com",
    title: "Cultural Historian",
    image: sarahImg,
    bio: "Dr. Sarah Reyes holds a PhD in Philippine Studies from the University of the Philippines Diliman. She has spent over 15 years documenting oral histories and cultural practices across the archipelago. Her work focuses on preserving indigenous knowledge and making it accessible to modern learners.",
    rating: 0,
    students: "0",
    courses: 0,
    tags: ["Cultural History", "Oral Traditions", "Community Stories"],
  },
  {
    id: "jose-reyes",
    name: "Jose Reyes",
    email: "mentor.jose@gmail.com",
    title: "History Professor",
    image: joseImg,
    bio: "Prof. Jose Reyes has been teaching Philippine History at Ateneo de Manila University for over 20 years. He is the author of several textbooks on Philippine history and has been featured in national documentaries about Philippine heritage sites.",
    rating: 4.8,
    students: "18k",
    courses: 2,
    tags: ["Philippine History", "Heritage Studies", "Colonial Period"],
  },
  {
    id: "ana-cruz",
    name: "Ana Cruz",
    email: "mentor.cruz@gmail.com",
    title: "Traditional Arts Master",
    image: anaImg,
    bio: "Ana Cruz is an award-winning textile artist who has dedicated her career to preserving traditional Filipino weaving techniques. She learned T'nalak weaving from T'boli master weavers and now teaches these ancient skills to a new generation of artists and cultural enthusiasts.",
    rating: 4.7,
    students: "10k",
    courses: 2,
    tags: ["Weaving", "Textile Arts", "Pottery", "Woodcarving"],
  },
  {
    id: "ramon-villanueva",
    name: "Ramon Villanueva",
    email: "mentor.villanueva@gmail.com",
    title: "Music & Dance Instructor",
    image: ramonImg,
    bio: "Ramon Villanueva is a professional kulintang player and folk dance choreographer who has performed at international festivals. With 15 years of experience, he brings traditional Filipino music and dance to life through engaging, step-by-step instruction.",
    rating: 4.8,
    students: "9k",
    courses: 2,
    tags: ["Kulintang", "Rondalla", "Folk Dance", "Tinikling"],
  },
  {
    id: "lita-mendoza",
    name: "Lita Mendoza",
    email: "mentor.mendoza@gmail.com",
    title: "Filipino Chef & Culinary Expert",
    image: litaImg,
    bio: "Lita Mendoza is a veteran Filipino chef with over 30 years of experience. She has been featured in numerous culinary magazines and TV shows, and runs a popular restaurant in Manila. Her courses focus on authentic recipes passed down through generations.",
    rating: 4.9,
    students: "14k",
    courses: 2,
    tags: ["Filipino Cuisine", "Regional Cooking", "Desserts"],
  },
];