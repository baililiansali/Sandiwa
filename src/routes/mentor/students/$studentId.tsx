import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Star, Award, Clock, BookOpen, CheckCircle, ExternalLink } from "lucide-react";
import { courses } from "@/data/mockCourses";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";
import { MOCK_STUDENTS } from "@/data/mockStudents";

// Define types
interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  enrolledDate: string;
  lastLesson: string;
  status: "active" | "completed";
}

interface Student {
  id: string;
  name: string;
  email: string;
  joined: string;
  totalProgress: number;
  completedCourses: number;
  totalCourses: number;
  avgRating: number;
  lastActive: string;
  courses: EnrolledCourse[];
}

export const Route = createFileRoute("/mentor/students/$studentId")({
  component: StudentDetailsPage,
});

function StudentDetailsPage() {
  const navigate = useNavigate();
  const { studentId } = Route.useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Show 2 courses per page

  // Find the student from MOCK_STUDENTS
  const mockStudent = MOCK_STUDENTS.find(s => s.id === studentId);
  
  // Helper function to get course title by ID - using actual courses from mockCourses.ts
  const getCourseTitle = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || `Course ${courseId}`;
  };

  // Get the actual course objects
  const getCourseById = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  };

  // Get enrollment data for this student
  let enrolledCourses: EnrolledCourse[] = [];
  
  if (mockStudent) {
    // Map the student's enrolled courses to the EnrolledCourse format using actual courses
    enrolledCourses = mockStudent.enrolledCourses.map((courseId) => {
      const actualCourse = getCourseById(courseId);
      const courseTitle = actualCourse?.title || getCourseTitle(courseId);
      
      // Generate realistic progress based on the student
      let progress = 0;
      let lastLesson = "";
      
      // Custom progress based on student ID and course
      if (studentId === "1") { // Maria Consuelo Santos
        if (courseId === "filipino-beginners") {
          progress = 90;
          lastLesson = "Lesson 8/10";
        } else if (courseId === "philippine-history") {
          progress = 65;
          lastLesson = "Lesson 5/8";
        }
      } else if (studentId === "2") { // Jose Miguel Dela Cruz
        if (courseId === "filipino-beginners") {
          progress = 78;
          lastLesson = "Lesson 7/10";
        } else if (courseId === "philippine-history") {
          progress = 42;
          lastLesson = "Lesson 3/8";
        }
      } else if (studentId === "3") { // Ana Patricia Reyes
        progress = 100;
        lastLesson = "Completed";
      } else if (studentId === "4") { // Carlos Alberto Mendoza
        progress = 88;
        lastLesson = "Lesson 7/8";
      } else if (studentId === "5") { // Maria Isabella Flores
        if (courseId === "filipino-beginners") {
          progress = 40;
          lastLesson = "Lesson 4/10";
        } else if (courseId === "philippine-history") {
          progress = 30;
          lastLesson = "Lesson 2/8";
        }
      } else if (studentId === "6") { // David Emmanuel Garcia
        progress = 85;
        lastLesson = "Lesson 7/8";
      } else if (studentId === "7") { // Elena Marie Rivera
        progress = 30;
        lastLesson = "Lesson 3/10";
      } else if (studentId === "8") { // Miguel Angelo Santos
        if (courseId === "filipino-beginners") {
          progress = 70;
          lastLesson = "Lesson 7/10";
        } else if (courseId === "philippine-history") {
          progress = 60;
          lastLesson = "Lesson 5/8";
        }
      } else if (studentId === "9") { // Maria Patricia Cruz
        progress = 95;
        lastLesson = "Lesson 9/10";
      } else if (studentId === "10") { // Ramon Gregorio Lopez
        if (courseId === "filipino-beginners") {
          progress = 50;
          lastLesson = "Lesson 5/10";
        } else if (courseId === "philippine-history") {
          progress = 45;
          lastLesson = "Lesson 4/8";
        }
      } else if (studentId === "11") { // Sofia Nicole Mendoza
        progress = 65;
        lastLesson = "Lesson 5/8";
      } else if (studentId === "12") { // Thomas Christian Lee
        if (courseId === "filipino-beginners") {
          progress = 20;
          lastLesson = "Lesson 2/10";
        } else if (courseId === "philippine-history") {
          progress = 15;
          lastLesson = "Lesson 1/8";
        }
      } else if (studentId === "13") { // Maria Theresa Villanueva
        progress = 88;
        lastLesson = "Lesson 8/10";
      } else if (studentId === "14") { // Francisco Jose Ramirez
        progress = 45;
        lastLesson = "Lesson 4/10";
      } else if (studentId === "15") { // Maria Elena Gonzales
        if (courseId === "filipino-beginners") {
          progress = 82;
          lastLesson = "Lesson 8/10";
        } else if (courseId === "philippine-history") {
          progress = 75;
          lastLesson = "Lesson 6/8";
        }
      } else {
        // Random progress for any other student
        progress = Math.floor(Math.random() * 100);
        const totalLessons = actualCourse?.lessons?.length || 10;
        lastLesson = progress === 100 ? "Completed" : `Lesson ${Math.floor(progress / 10)}/${totalLessons}`;
      }
      
      return {
        id: courseId,
        title: courseTitle,
        progress: progress,
        enrolledDate: mockStudent.enrolledDate,
        lastLesson: lastLesson,
        status: progress === 100 ? "completed" : "active"
      };
    });
  }
  
  // Calculate overall stats from enrolled courses
  const totalProgress = enrolledCourses.length > 0 
    ? Math.floor(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
    : 0;
  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
  const totalCourses = enrolledCourses.length;

  const student: Student = {
    id: studentId,
    name: mockStudent?.name || `Student ${studentId}`,
    email: mockStudent?.email || `student${studentId}@example.com`,
    joined: mockStudent?.enrolledDate || "Mar 1, 2024",
    totalProgress,
    completedCourses,
    totalCourses,
    avgRating: mockStudent ? parseFloat(mockStudent.rating) : 4.2,
    lastActive: mockStudent?.lastActive || "3 days ago",
    courses: enrolledCourses,
  };

  // Get course name mapping for display
  const getCourseNames = () => {
    return enrolledCourses.map(c => c.title).join(", ");
  };

  const handleMessage = () => {
    const subject = encodeURIComponent(`Question about your courses on Sandiwa`);
    const body = encodeURIComponent(
      `Hello ${student.name},\n\n` +
      `I hope you're doing well. I'm reaching out regarding your enrolled courses.\n\n` +
      `[Your message here]\n\n` +
      `Best regards,\n` +
      `Sandiwa Team`
    );
    window.location.href = `mailto:${student.email}?subject=${subject}&body=${body}`;
  };

  // Dynamic back button - goes back to previous page using browser history
  const handleGoBack = () => {
    window.history.back();
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = student.courses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <MentorDashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        {/* Student Header */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-xl font-serif font-bold shadow-md">
                {student.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy">{student.name}</h1>
                <p className="text-muted-foreground">{student.email}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Member since {student.joined}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Last active {student.lastActive}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-gold hover:bg-gold/90 text-white" onClick={handleMessage}>
                <Mail className="h-4 w-4 mr-2" /> Message
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Enrolled Courses</span>
            </div>
            <p className="text-2xl font-bold text-navy">{student.totalCourses}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {student.totalCourses === 1 ? "1 course" : `${student.totalCourses} courses`}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Award className="h-4 w-4" />
              <span className="text-sm">Completed Courses</span>
            </div>
            <p className="text-2xl font-bold text-navy">{student.completedCourses}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {student.completedCourses === 1 ? "1 completed" : `${student.completedCourses} completed`}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Overall Progress</span>
            </div>
            <p className="text-2xl font-bold text-navy">{student.totalProgress}%</p>
            <p className="text-xs text-muted-foreground mt-1">Average across all courses</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Avg. Rating Given</span>
            </div>
            <p className="text-2xl font-bold text-navy">{student.avgRating}</p>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-navy text-lg">Enrolled Courses</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {student.totalCourses} course{student.totalCourses !== 1 ? 's' : ''} • {student.completedCourses} completed
                </p>
              </div>
            </div>
          </div>
          
          {student.totalCourses > 0 ? (
            <>
              <div className="divide-y divide-border">
                {paginatedCourses.map((course, index) => (
                  <div key={course.id} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground">#{startIndex + index + 1}</span>
                          <h4 className="font-medium text-navy">{course.title}</h4>
                          {course.status === "completed" && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" /> Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enrolled: {course.enrolledDate} • Last lesson: {course.lastLesson}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 max-w-xs">
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${course.progress}%`,
                                  background: course.progress === 100 ? '#10b981' : '#c9a03d'
                                }} 
                              />
                            </div>
                          </div>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                      </div>
                      <Link to="/mentor/courses/manage/$courseId" params={{ courseId: course.id }}>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          <ExternalLink className="h-3 w-3 mr-1" /> View Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Component */}
              {student.courses.length > itemsPerPage && (
                <div className="px-6 py-4 border-t border-border">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={student.courses.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    showEntries={true}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">This student is not enrolled in any of your courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}