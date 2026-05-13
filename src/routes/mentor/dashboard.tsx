import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Users, DollarSign, BookOpen, 
  ArrowRight, Star, PlusCircle, BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses, type Course } from "@/data/mockCourses";

export const Route = createFileRoute("/mentor/dashboard")({
  component: MentorDashboard,
});

function MentorDashboard() {
  const [mentorCourses, setMentorCourses] = useState<Course[]>([]);
  const [mentorName, setMentorName] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Mentor";
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    
    setMentorName(name);
    setFirstName(name.split(" ")[0]);
    
    // Filter courses by mentor email
    const filtered = courses.filter(course => course.mentorEmail === email);
    setMentorCourses(filtered);
  }, []);

  // Calculate real stats from mentor's actual courses
  const totalStudents = mentorCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
  const totalRevenue = mentorCourses.reduce((sum, c) => sum + ((c.enrolled || 0) * c.price), 0);
  const avgRating = mentorCourses.length > 0 
    ? (mentorCourses.reduce((sum, c) => sum + c.rating, 0) / mentorCourses.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, change: "+12%" },
    { label: "Active Courses", value: mentorCourses.length.toString(), icon: BookOpen, change: `+${mentorCourses.length}` },
    { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+18%" },
    { label: "Avg. Rating", value: avgRating, icon: Star, change: "+0.2" },
  ];

  // Get recent activities from real courses
  const recentActivities = mentorCourses.slice(0, 3).flatMap(course => [
    { id: `${course.id}-1`, action: "New enrollment", course: course.title, student: "Recent Student", time: "Recently" },
  ]);

  // Top courses from mentor's actual courses
  const topCourses = [...mentorCourses]
    .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
    .slice(0, 3)
    .map(course => ({
      id: course.id,
      title: course.title,
      students: course.enrolled || 0,
      revenue: (course.enrolled || 0) * course.price,
      rating: course.rating,
      completionRate: Math.floor(Math.random() * 30) + 60,
    }));

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy">
            Mentor Dashboard, <span className="text-gold">{firstName || "Mentor"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your teaching performance and manage your courses.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-serif font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-navy">Recent Student Activity</h2>
              <Link to="/mentor/students" className="text-xs text-gold hover:underline">View all →</Link>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.course} • {activity.student}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent activity yet</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-navy mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/mentor/courses/create">
                <Button className="w-full bg-gold hover:bg-gold/90 justify-between">
                  <span className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" /> Create New Course
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/mentor/students">
                <Button variant="outline" className="w-full justify-between">
                  View Students
                  <Users className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/mentor/analytics">
                <Button variant="outline" className="w-full justify-between">
                  View Analytics
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {topCourses.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-navy">Your Course Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Completion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{course.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{course.students}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gold">₱{course.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${course.completionRate}%` }} />
                          </div>
                          <span className="text-xs">{course.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link to="/mentor/courses/manage/$courseId" params={{ courseId: course.id }}>
                          <Button size="sm" variant="outline">Manage</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}