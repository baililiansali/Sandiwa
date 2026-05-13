export interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  videoUrl?: string;
  videoFile?: File;
  videoPreview?: string;
}

export interface RecentReview {
  id: string;
  studentName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  students: number;
  rating: number;
  totalReviews: number;
}

export interface RecentStudent {
  id: string;
  name: string;
  activity: string;
  time: string;
}

// Mock lessons data
export const mockLessons: Lesson[] = [
  { id: "1", title: "Introduction to Filipino", duration: 15, completed: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "2", title: "Basic Greetings", duration: 20, completed: true },
  { id: "3", title: "Numbers and Counting", duration: 25, completed: false },
  { id: "4", title: "Common Phrases", duration: 30, completed: false },
];

// Mock course data
export const mockCourse: CourseData = {
  id: "course_123",
  title: "Philippine History and Heritage Masterclass",
  description: "Learn basic Filipino language skills for everyday conversations",
  price: 880,
  students: 8900,
  rating: 4.8,
  totalReviews: 1245,
};

// Mock recent reviews data
export const mockRecentReviews: RecentReview[] = [
  {
    id: "1",
    studentName: "Maria Santos",
    rating: 5,
    title: "Absolutely amazing course!",
    content: "This course exceeded my expectations! The instructor was very knowledgeable and the lessons were well-structured. I learned so much about Philippine history that I never knew before.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    studentName: "John Reyes",
    rating: 4,
    title: "Great content, but pacing could be better",
    content: "The content is excellent and very informative. However, some lessons felt a bit rushed. Would love to see more in-depth explanations on certain topics.",
    date: "5 days ago",
    verified: true,
  },
  {
    id: "3",
    studentName: "Ana Cruz",
    rating: 5,
    title: "Life-changing experience!",
    content: "This course opened my eyes to our rich heritage. The video lessons were engaging and the quizzes helped reinforce learning.",
    date: "1 week ago",
    verified: true,
  },
];

// Mock recent students data
export const mockRecentStudents: RecentStudent[] = [
  { id: "1", name: "Maria Santos", activity: "Completed Lesson 3", time: "2 hours ago" },
  { id: "2", name: "John Reyes", activity: "Completed Lesson 2", time: "5 hours ago" },
  { id: "3", name: "Ana Cruz", activity: "Started Lesson 4", time: "1 day ago" },
];

// Enrolled students table data
export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  date: string;
  progress: number;
  lastActive: string;
}

export const mockEnrolledStudents: EnrolledStudent[] = [
  { id: "1", name: "Maria Santos", email: "maria@example.com", date: "Jan 15, 2024", progress: 75, lastActive: "2 hours ago" },
  { id: "2", name: "John Reyes", email: "john@example.com", date: "Jan 10, 2024", progress: 45, lastActive: "1 day ago" },
  { id: "3", name: "Ana Cruz", email: "ana@example.com", date: "Jan 5, 2024", progress: 90, lastActive: "5 hours ago" },
];