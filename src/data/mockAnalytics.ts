import type { Course } from "./mockCourses";

export interface MonthlyData {
  labels: string[];
  students: number[];
  revenue: number[];
  engagement: number[];
  completion: number[];
}

export interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  revenue: number;
  rating: number;
  growth: number;
  completionRate: number;
}

export interface EngagementMetrics {
  averageTimeSpent: number; // in minutes
  activeStudents: number;
  inactiveStudents: number;
  averageLessonsCompleted: number;
  interactionRate: number; // percentage
  weeklyActivity: number[];
}

export interface CompletionMetrics {
  overall: number;
  certificateIssued: number;
  droppedOut: number;
  byCourse: {
    courseId: string;
    courseTitle: string;
    rate: number;
    completedStudents: number;
    totalStudents: number;
  }[];
}

export interface GrowthData {
  students: { value: number; isUp: boolean };
  revenue: { value: number; isUp: boolean };
  views: { value: number; isUp: boolean };
  engagement: { value: number; isUp: boolean };
  completion: { value: number; isUp: boolean };
}

// Jose Reyes' courses from mockCourses.ts
const JOSE_REYES_COURSES = ["philippine-history", "philippines-heroes"];

// Get total students for Jose Reyes' courses
export const getTotalStudents = (courses: Course[]): number => {
  return courses
    .filter(c => JOSE_REYES_COURSES.includes(c.id))
    .reduce((sum, c) => sum + (c.enrolled || 0), 0);
};

// Get total revenue for Jose Reyes' courses
export const getTotalRevenue = (courses: Course[]): number => {
  return courses
    .filter(c => JOSE_REYES_COURSES.includes(c.id))
    .reduce((sum, c) => sum + ((c.enrolled || 0) * c.price), 0);
};

// Monthly data for charts - by year (based on Jose Reyes' courses)
export const YEARLY_DATA: Record<string, MonthlyData> = {
  "2024": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    students: [25, 28, 32, 35, 38, 42, 45, 48, 50, 52, 55, 58],
    revenue: [12500, 14000, 16000, 17500, 19000, 21000, 22500, 24000, 25000, 26000, 27500, 29000],
    engagement: [55, 58, 60, 62, 65, 68, 70, 72, 73, 75, 76, 77],
    completion: [48, 50, 52, 55, 58, 60, 62, 64, 65, 67, 68, 69],
  },
  "2025": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    students: [60, 65, 72, 78, 85, 92, 98, 105, 110, 115, 120, 128],
    revenue: [30000, 32500, 36000, 39000, 42500, 46000, 49000, 52500, 55000, 57500, 60000, 64000],
    engagement: [68, 70, 72, 74, 76, 78, 79, 80, 81, 82, 83, 84],
    completion: [62, 64, 66, 68, 70, 71, 72, 73, 74, 75, 76, 77],
  },
  "2026": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    students: [130, 135, 142, 148, 155, 162, 168, 175, 180, 185, 190, 198],
    revenue: [65000, 67500, 71000, 74000, 77500, 81000, 84000, 87500, 90000, 92500, 95000, 99000],
    engagement: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
    completion: [72, 73, 74, 75, 76, 77, 78, 78, 79, 79, 80, 80],
  },
};

export const getYearlyData = (year: string): MonthlyData => {
  return YEARLY_DATA[year] || YEARLY_DATA["2026"];
};

export const AVAILABLE_YEARS = ["2024", "2025", "2026"];

// Growth percentages by year
export const GROWTH_DATA_BY_YEAR: Record<string, GrowthData> = {
  "2024": {
    students: { value: 8, isUp: true },
    revenue: { value: 10, isUp: true },
    views: { value: 3, isUp: false },
    engagement: { value: 5, isUp: true },
    completion: { value: 4, isUp: true },
  },
  "2025": {
    students: { value: 15, isUp: true },
    revenue: { value: 18, isUp: true },
    views: { value: 2, isUp: false },
    engagement: { value: 10, isUp: true },
    completion: { value: 7, isUp: true },
  },
  "2026": {
    students: { value: 12, isUp: true },
    revenue: { value: 14, isUp: true },
    views: { value: 5, isUp: false },
    engagement: { value: 8, isUp: true },
    completion: { value: 6, isUp: true },
  },
};

export const getGrowthData = (year: string): GrowthData => {
  return GROWTH_DATA_BY_YEAR[year] || GROWTH_DATA_BY_YEAR["2026"];
};

// Engagement Metrics by year (based on Jose Reyes' students)
export const ENGAGEMENT_METRICS_BY_YEAR: Record<string, EngagementMetrics> = {
  "2024": {
    averageTimeSpent: 32,
    activeStudents: 412,
    inactiveStudents: 189,
    averageLessonsCompleted: 6.2,
    interactionRate: 68,
    weeklyActivity: [55, 60, 65, 62, 70, 50, 45],
  },
  "2025": {
    averageTimeSpent: 42,
    activeStudents: 678,
    inactiveStudents: 210,
    averageLessonsCompleted: 7.8,
    interactionRate: 74,
    weeklyActivity: [60, 68, 75, 72, 80, 55, 50],
  },
  "2026": {
    averageTimeSpent: 47,
    activeStudents: 892,
    inactiveStudents: 245,
    averageLessonsCompleted: 8.5,
    interactionRate: 78,
    weeklyActivity: [65, 72, 80, 78, 85, 60, 55],
  },
};

export const getEngagementMetrics = (year: string): EngagementMetrics => {
  return ENGAGEMENT_METRICS_BY_YEAR[year] || ENGAGEMENT_METRICS_BY_YEAR["2026"];
};

// Completion Metrics by year - ONLY Jose Reyes' 2 COURSES
export const COMPLETION_METRICS_BY_YEAR: Record<string, CompletionMetrics> = {
  "2024": {
    overall: 69,
    certificateIssued: 850,
    droppedOut: 320,
    byCourse: [
      { 
        courseId: "philippine-history", 
        courseTitle: "Philippine History and Heritage Masterclass", 
        rate: 72, 
        completedStudents: 425, 
        totalStudents: 590 
      },
      { 
        courseId: "philippines-heroes", 
        courseTitle: "Unsung Heroes of the Philippines", 
        rate: 65, 
        completedStudents: 280, 
        totalStudents: 431 
      },
    ],
  },
  "2025": {
    overall: 74,
    certificateIssued: 1350,
    droppedOut: 380,
    byCourse: [
      { 
        courseId: "philippine-history", 
        courseTitle: "Philippine History and Heritage Masterclass", 
        rate: 78, 
        completedStudents: 720, 
        totalStudents: 923 
      },
      { 
        courseId: "philippines-heroes", 
        courseTitle: "Unsung Heroes of the Philippines", 
        rate: 70, 
        completedStudents: 450, 
        totalStudents: 643 
      },
    ],
  },
  "2026": {
    overall: 78,
    certificateIssued: 1850,
    droppedOut: 420,
    byCourse: [
      { 
        courseId: "philippine-history", 
        courseTitle: "Philippine History and Heritage Masterclass", 
        rate: 82, 
        completedStudents: 1025, 
        totalStudents: 1250 
      },
      { 
        courseId: "philippines-heroes", 
        courseTitle: "Unsung Heroes of the Philippines", 
        rate: 75, 
        completedStudents: 580, 
        totalStudents: 773 
      },
    ],
  },
};

export const getCompletionMetrics = (year: string): CompletionMetrics => {
  return COMPLETION_METRICS_BY_YEAR[year] || COMPLETION_METRICS_BY_YEAR["2026"];
};

// Helper function to get top performing courses for Jose Reyes
export const getTopPerformingCourses = (courses: Course[], year: string): CoursePerformance[] => {
  const completionData = getCompletionMetrics(year);
  
  // Filter to only Jose Reyes' courses
  const existingCourses = courses.filter(course => 
    course.id === "philippine-history" || course.id === "philippines-heroes"
  );
  
  return existingCourses
    .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
    .map((course) => ({
      id: course.id,
      title: course.title,
      students: course.enrolled || 0,
      revenue: (course.enrolled || 0) * course.price,
      rating: course.rating,
      growth: Math.floor(Math.random() * 20) + 5,
      completionRate: completionData.byCourse.find((c) => c.courseId === course.id)?.rate || 70,
    }));
};

// Weekly activity labels
export const WEEKLY_LABELS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];