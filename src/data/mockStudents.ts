// src/data/mockStudents.ts

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  coursesCount: number;
  enrolledCourses: string[]; // Array of course IDs from mockCourses.ts
  enrolledCourseTitles: string[]; // Array of course titles
  progress: number;
  rating: string;
  lastActive: string;
}

// Jose Reyes' courses from mockCourses.ts
export const COURSES = [
  { id: "philippine-history", title: "Philippine History and Heritage Masterclass" },
  { id: "philippines-heroes", title: "Unsung Heroes of the Philippines" },
];

// Mock students data - Students enrolled in Jose Reyes' courses only
// Each student is enrolled in one or both of Jose Reyes' courses
export const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Maria Consuelo Santos",
    email: "maria.santos@example.com",
    enrolledDate: "Jan 15, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 75,
    rating: "4.8",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jose Miguel Dela Cruz",
    email: "jose.delacruz@example.com",
    enrolledDate: "Feb 10, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 60,
    rating: "4.5",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Ana Patricia Reyes",
    email: "ana.reyes@example.com",
    enrolledDate: "Mar 1, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippine-history"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass"],
    progress: 100,
    rating: "4.9",
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    name: "Carlos Alberto Mendoza",
    email: "carlos.mendoza@example.com",
    enrolledDate: "Jan 5, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippines-heroes"],
    enrolledCourseTitles: ["Unsung Heroes of the Philippines"],
    progress: 55,
    rating: "4.2",
    lastActive: "5 days ago",
  },
  {
    id: "5",
    name: "Maria Isabella Flores",
    email: "bella.flores@example.com",
    enrolledDate: "Feb 20, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 40,
    rating: "4.6",
    lastActive: "1 hour ago",
  },
  {
    id: "6",
    name: "David Emmanuel Garcia",
    email: "david.garcia@example.com",
    enrolledDate: "Jan 25, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippine-history"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass"],
    progress: 85,
    rating: "4.7",
    lastActive: "2 days ago",
  },
  {
    id: "7",
    name: "Elena Marie Rivera",
    email: "elena.rivera@example.com",
    enrolledDate: "Mar 10, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippines-heroes"],
    enrolledCourseTitles: ["Unsung Heroes of the Philippines"],
    progress: 30,
    rating: "4.3",
    lastActive: "6 hours ago",
  },
  {
    id: "8",
    name: "Miguel Angelo Santos",
    email: "miguel.santos@example.com",
    enrolledDate: "Jan 30, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 70,
    rating: "4.4",
    lastActive: "4 days ago",
  },
  {
    id: "9",
    name: "Maria Patricia Cruz",
    email: "patricia.cruz@example.com",
    enrolledDate: "Feb 5, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippine-history"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass"],
    progress: 95,
    rating: "5.0",
    lastActive: "12 hours ago",
  },
  {
    id: "10",
    name: "Ramon Gregorio Lopez",
    email: "ramon.lopez@example.com",
    enrolledDate: "Feb 15, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 50,
    rating: "4.1",
    lastActive: "3 days ago",
  },
  {
    id: "11",
    name: "Sofia Nicole Mendoza",
    email: "sofia.mendoza@example.com",
    enrolledDate: "Mar 5, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippines-heroes"],
    enrolledCourseTitles: ["Unsung Heroes of the Philippines"],
    progress: 65,
    rating: "4.5",
    lastActive: "8 hours ago",
  },
  {
    id: "12",
    name: "Thomas Christian Lee",
    email: "tommy.lee@example.com",
    enrolledDate: "Jan 10, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 20,
    rating: "4.0",
    lastActive: "1 week ago",
  },
  {
    id: "13",
    name: "Maria Theresa Villanueva",
    email: "theresa.villanueva@example.com",
    enrolledDate: "Feb 28, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippine-history"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass"],
    progress: 88,
    rating: "4.7",
    lastActive: "1 day ago",
  },
  {
    id: "14",
    name: "Francisco Jose Ramirez",
    email: "francisco.ramirez@example.com",
    enrolledDate: "Mar 12, 2024",
    coursesCount: 1,
    enrolledCourses: ["philippines-heroes"],
    enrolledCourseTitles: ["Unsung Heroes of the Philippines"],
    progress: 45,
    rating: "4.2",
    lastActive: "5 hours ago",
  },
  {
    id: "15",
    name: "Maria Elena Gonzales",
    email: "maria.gonzales@example.com",
    enrolledDate: "Jan 18, 2024",
    coursesCount: 2,
    enrolledCourses: ["philippine-history", "philippines-heroes"],
    enrolledCourseTitles: ["Philippine History and Heritage Masterclass", "Unsung Heroes of the Philippines"],
    progress: 82,
    rating: "4.9",
    lastActive: "3 hours ago",
  },
];

// Course enrollment summary for Jose Reyes' courses
export const COURSE_ENROLLMENT_SUMMARY = {
  "philippine-history": {
    title: "Philippine History and Heritage Masterclass",
    studentCount: MOCK_STUDENTS.filter(s => s.enrolledCourses.includes("philippine-history")).length,
    students: MOCK_STUDENTS.filter(s => s.enrolledCourses.includes("philippine-history")).map(s => s.name),
  },
  "philippines-heroes": {
    title: "Unsung Heroes of the Philippines",
    studentCount: MOCK_STUDENTS.filter(s => s.enrolledCourses.includes("philippines-heroes")).length,
    students: MOCK_STUDENTS.filter(s => s.enrolledCourses.includes("philippines-heroes")).map(s => s.name),
  },
};