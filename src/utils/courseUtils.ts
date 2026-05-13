import { courses } from "@/data/mockCourses";

export const getMentorCourses = (mentorEmail: string) => {
  return courses.filter(course => course.mentorEmail === mentorEmail);
};

export const getMentorStats = (mentorEmail: string) => {
  const mentorCourses = getMentorCourses(mentorEmail);
  return {
    totalCourses: mentorCourses.length,
    totalStudents: mentorCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0),
    totalRevenue: mentorCourses.reduce((sum, c) => sum + ((c.enrolled || 0) * c.price), 0),
    averageRating: mentorCourses.reduce((sum, c) => sum + c.rating, 0) / (mentorCourses.length || 1),
  };
};