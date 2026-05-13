import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Users, Star, Trash2, Calendar, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { courses, type Course } from "@/data/mockCourses";
import { formatRelativeTime } from "@/utils/dateUtils";

export const Route = createFileRoute("/mentor/courses/")({
  head: () => ({
    meta: [
      { title: "My Courses — Sandiwa Mentor" },
      { name: "description", content: "Manage your courses." },
    ],
  }),
  component: MentorCoursesPage,
});

function MentorCoursesPage() {
  const [mentorCourses, setMentorCourses] = useState<Course[]>([]);
  const [mentorEmail, setMentorEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    setMentorEmail(email);
    
    const filtered = courses.filter(course => course.mentorEmail === email);
    setMentorCourses(filtered);
  }, []);

  const handleDelete = (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setMentorCourses(mentorCourses.filter(c => c.id !== courseId));
      toast.success("Course deleted successfully");
    }
  };

  // Calculate stats based on mentor's courses only
  const stats = {
    total: mentorCourses.length,
    students: mentorCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0),
    revenue: mentorCourses.reduce((sum, c) => sum + ((c.enrolled || 0) * c.price), 0),
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">My Courses</h1>
            <p className="text-muted-foreground mt-1">Manage and track your courses</p>
          </div>
          <Button asChild className="bg-gold hover:bg-gold/90">
            <Link to="/mentor/courses/create">
              <Plus className="h-4 w-4 mr-2" /> Create New Course
            </Link>
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.students.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-gold">₱{stats.revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        {/* Courses Grid */}
        {mentorCourses.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-border bg-card">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-navy">No courses yet</h3>
            <p className="text-muted-foreground mt-1">Start creating your first course!</p>
            <Button asChild className="mt-4 bg-gold hover:bg-gold/90">
              <Link to="/mentor/courses/create">
                <Plus className="h-4 w-4 mr-2" /> Create New Course
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentorCourses.map((course) => (
              <div key={course.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2">{course.title}</h3>
                  
                  {/* Date info */}
                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {formatRelativeTime(course.createdAt)}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" /> {course.enrolled?.toLocaleString() || 0} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                    {/* FIXED: Show course price instead of total revenue */}
                    <span className="font-serif font-bold text-gold">₱{course.price.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Link to="/mentor/courses/manage/$courseId" params={{ courseId: course.id }}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" /> Manage
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}