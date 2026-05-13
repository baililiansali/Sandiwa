import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Users, DollarSign, Star, 
  Download, ArrowUp, ArrowDown, BookOpen,
  Activity, Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses, type Course } from "@/data/mockCourses";
import { 
  getYearlyData,
  getGrowthData,
  getTopPerformingCourses,
  getTotalStudents,
  getTotalRevenue,
  type MonthlyData,
  type CoursePerformance
} from "@/data/mockAnalytics";
import { DateRangePicker } from "@/components/DateRangePicker";

export const Route = createFileRoute("/mentor/analytics/")({
  head: () => ({
    meta: [
      { title: "Analytics Overview — Sandiwa Mentor" },
      { name: "description", content: "View your course performance overview." },
    ],
  }),
  component: AnalyticsOverviewPage,
});

function AnalyticsOverviewPage() {
  const [mentorCourses, setMentorCourses] = useState<Course[]>([]);
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "month" | "year" | "custom">("year");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState<"students" | "revenue">("students");
  const [topCourses, setTopCourses] = useState<CoursePerformance[]>([]);
  const [yearlyData, setYearlyData] = useState<MonthlyData>(getYearlyData("2026"));
  const [growthData, setGrowthData] = useState(getGrowthData("2026"));

  useEffect(() => {
    // Filter to only Jose Reyes' courses
    const filtered = courses.filter(course => course.mentorEmail === "mentor.jose@gmail.com");
    setMentorCourses(filtered);
    setTopCourses(getTopPerformingCourses(filtered, "2026"));
  }, []);

  useEffect(() => {
    setYearlyData(getYearlyData("2026"));
    setGrowthData(getGrowthData("2026"));
    setTopCourses(getTopPerformingCourses(mentorCourses, "2026"));
  }, [mentorCourses]);

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

  const totalStats = {
    totalStudents: getTotalStudents(mentorCourses),
    totalRevenue: getTotalRevenue(mentorCourses),
    totalCourses: mentorCourses.length,
    averageRating: mentorCourses.length > 0 
      ? (mentorCourses.reduce((sum, c) => sum + c.rating, 0) / mentorCourses.length).toFixed(1)
      : "0",
  };

  const getChartData = () => {
    if (selectedRange === "year") {
      return {
        labels: yearlyData.labels,
        students: yearlyData.students,
        revenue: yearlyData.revenue,
      };
    } else {
      const days = selectedRange === "today" ? 1 : selectedRange === "week" ? 7 : 30;
      const labels = [];
      const students = [];
      const revenue = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        students.push(Math.floor(Math.random() * 50) + 10);
        revenue.push(Math.floor(Math.random() * 25000) + 5000);
      }
      return { labels, students, revenue };
    }
  };

  const chartData = getChartData();

  const getMetricData = () => {
    switch (selectedMetric) {
      case "students":
        return {
          data: chartData.students,
          color: "bg-gold",
          label: "Students",
          format: (v: number) => v.toString(),
        };
      case "revenue":
        return {
          data: chartData.revenue,
          color: "bg-green-500",
          label: "Revenue",
          format: (v: number) => `₱${(v / 1000).toFixed(0)}k`,
        };
    }
  };

  const metricData = getMetricData();

  const handleExport = () => {
    alert(`Exporting analytics data for ${selectedRange} range...`);
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Analytics Overview</h1>
            <p className="text-muted-foreground mt-1">
              Track your course performance and revenue trends
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.students.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.students.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.students.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{totalStats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.revenue.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.revenue.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.revenue.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-gold">₱{totalStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.views.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.views.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.views.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{totalStats.totalCourses}</p>
              <p className="text-xs text-muted-foreground">Active Courses</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.engagement.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.engagement.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.engagement.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{totalStats.averageRating}</p>
              <p className="text-xs text-muted-foreground">Avg. Rating / 5.0</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("students")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "students"
                ? "bg-gold text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Students
          </button>
          <button
            onClick={() => setSelectedMetric("revenue")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "revenue"
                ? "bg-gold text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-2" />
            Revenue
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-serif text-lg font-bold text-navy mb-4">
            {selectedMetric === "students" ? "Student Growth" : "Revenue Trend"}
          </h3>
          <div className="h-80">
            <div className="flex items-end h-64 gap-3">
              {metricData.data.map((value, index) => {
                const maxValue = Math.max(...metricData.data);
                const height = (value / maxValue) * 100;
                const displayValue = metricData.format(value);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full">
                      <div 
                        className={`w-full ${metricData.color} rounded-t-lg transition-all duration-500 cursor-pointer group-hover:opacity-80`}
                        style={{ height: `${height}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {metricData.label}: {displayValue}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{chartData.labels[index]}</span>
                    <span className="text-xs font-semibold text-navy">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-navy">Top Performing Courses</h3>
            <Link to="/mentor/analytics/courses">
              <Button variant="ghost" size="sm" className="text-gold">
                View All →
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-navy">{course.title}</td>
                    <td className="px-6 py-4 text-sm">{course.students.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gold">₱{course.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold text-gold" />
                        <span className="text-sm">{course.rating}</span>
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