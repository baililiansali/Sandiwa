import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Star, Download, Calendar,
  Users, DollarSign, BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses, type Course } from "@/data/mockCourses";
import { DateRangePicker } from "@/components/DateRangePicker";

export const Route = createFileRoute("/mentor/analytics/courses")({
  head: () => ({
    meta: [
      { title: "My Courses — Sandiwa Mentor" },
      { name: "description", content: "View your course performance metrics." },
    ],
  }),
  component: TopCoursesPage,
});

interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  revenue: number;
  rating: number;
  completionRate: number;
  enrolled: number;
  price: number;
}

function TopCoursesPage() {
  const [mentorCourses, setMentorCourses] = useState<Course[]>([]);
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "month" | "year" | "custom">("year");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [topCourses, setTopCourses] = useState<CoursePerformance[]>([]);

  useEffect(() => {
    // Filter to only Jose Reyes' courses
    const filtered = courses.filter(course => course.mentorEmail === "mentor.jose@gmail.com");
    setMentorCourses(filtered);
    
    // Map to performance data
    const performanceData = filtered.map(course => ({
      id: course.id,
      title: course.title,
      students: course.enrolled || 0,
      revenue: (course.enrolled || 0) * course.price,
      rating: course.rating,
      completionRate: Math.floor(Math.random() * 20) + 70,
      enrolled: course.enrolled || 0,
      price: course.price,
    }));
    
    // Sort by students (most enrolled first)
    performanceData.sort((a, b) => b.students - a.students);
    setTopCourses(performanceData);
  }, []);

  const handleRangeChange = (range: "today" | "week" | "month" | "year" | "custom") => {
    setSelectedRange(range);
    const now = new Date();
    
    switch (range) {
      case "today": {
        setDateRange({ from: now, to: now });
        break;
      }
      case "week": {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        setDateRange({ from: weekAgo, to: now });
        break;
      }
      case "month": {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        setDateRange({ from: monthAgo, to: now });
        break;
      }
      case "year": {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        setDateRange({ from: yearAgo, to: now });
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleExport = () => {
    alert(`Exporting course data for ${selectedRange} range...`);
  };

  // Calculate summary stats
  const totalStudents = topCourses.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = topCourses.reduce((sum, c) => sum + c.revenue, 0);
  const averageRating = topCourses.length > 0 
    ? (topCourses.reduce((sum, c) => sum + c.rating, 0) / topCourses.length).toFixed(1)
    : "0";

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Track your course performance, students, and revenue
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "today", label: "Today" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
              { value: "custom", label: "Custom" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleRangeChange(option.value as typeof selectedRange)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  selectedRange === option.value
                    ? "bg-gold text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {selectedRange === "custom" && (
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              onPresetChange={(preset) => {
                if (preset !== "custom") {
                  setSelectedRange(preset as typeof selectedRange);
                }
              }}
            />
          )}
          
          {selectedRange !== "custom" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>{selectedRange === "today" ? "Today" : selectedRange === "week" ? "Last 7 Days" : selectedRange === "month" ? "Last 30 Days" : "This Year"}</span>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Total Courses</span>
            </div>
            <p className="text-2xl font-bold text-navy">{topCourses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active courses</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Total Students</span>
            </div>
            <p className="text-2xl font-bold text-navy">{totalStudents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gold">₱{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Average Rating</span>
            </div>
            <p className="text-2xl font-bold text-navy">{averageRating}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-serif text-lg font-bold text-navy">Course Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">#</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topCourses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-muted-foreground">#{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">{course.title}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gold">₱{course.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{course.students.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gold" />
                        <span className="text-sm font-semibold text-gold">₱{course.revenue.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold text-gold" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all" 
                            style={{ 
                              width: `${course.completionRate}%`,
                              background: course.completionRate >= 80 ? '#10b981' : course.completionRate >= 60 ? '#c9a03d' : '#ef4444'
                            }} 
                          />
                        </div>
                        <span className="text-xs font-medium">{course.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}