// src/routes/admin/analytics/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Users, 
  DollarSign, 
  Star, 
  Download, 
  ArrowUp, 
  ArrowDown, 
  BookOpen,
  Activity, 
  Calendar,
  UserCheck,
  UserPlus,
  UserX,
  MessageSquare,
  Flag,
  Eye,
  Clock,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Target,
  ThumbsUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";

export const Route = createFileRoute("/admin/analytics/")({
  head: () => ({
    meta: [
      { title: "Analytics — Sandiwa Admin" },
      { name: "description", content: "View platform-wide analytics and performance metrics." },
    ],
  }),
  component: AdminAnalyticsPage,
});

// Mock data types
interface MonthlyData {
  labels: string[];
  students: number[];
  revenue: number[];
  courses: number[];
  discussions: number[];
  events: number[];
}

interface GrowthData {
  students: { value: number; isUp: boolean };
  revenue: { value: number; isUp: boolean };
  courses: { value: number; isUp: boolean };
  engagement: { value: number; isUp: boolean };
  users: { value: number; isUp: boolean };
  reports: { value: number; isUp: boolean };
}

interface PlatformMetrics {
  totalUsers: number;
  totalMentors: number;
  totalLearners: number;
  totalCourses: number;
  totalRevenue: number;
  averageRating: number;
  totalDiscussions: number;
  totalEvents: number;
  totalReports: number;
  pendingReports: number;
  activeUsers: number;
  completionRate: number;
}

// Mock data generation
const getYearlyData = (year: string): MonthlyData => {
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    students: [1250, 1450, 1780, 2100, 2450, 2890, 3340, 3780, 4120, 4560, 4890, 5120],
    revenue: [125000, 145000, 178000, 210000, 245000, 289000, 334000, 378000, 412000, 456000, 489000, 512000],
    courses: [12, 14, 16, 18, 19, 20, 21, 22, 23, 23, 24, 24],
    discussions: [45, 52, 48, 61, 73, 68, 82, 79, 94, 101, 112, 108],
    events: [12, 15, 18, 22, 28, 25, 31, 29, 35, 38, 42, 40],
  };
};

const getGrowthData = (): GrowthData => {
  return {
    students: { value: 12.5, isUp: true },
    revenue: { value: 18.3, isUp: true },
    courses: { value: 8.2, isUp: true },
    engagement: { value: 5.7, isUp: true },
    users: { value: 15.2, isUp: true },
    reports: { value: -3.5, isUp: false },
  };
};

const getPlatformMetrics = (): PlatformMetrics => {
  return {
    totalUsers: 12450,
    totalMentors: 8,
    totalLearners: 12442,
    totalCourses: 24,
    totalRevenue: 1250000,
    averageRating: 4.7,
    totalDiscussions: 342,
    totalEvents: 28,
    totalReports: 45,
    pendingReports: 8,
    activeUsers: 8923,
    completionRate: 68,
  };
};

const WEEKLY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_ACTIVITY = [65, 72, 78, 85, 92, 88, 76];

function AdminAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "month" | "year" | "custom">("year");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMetric, setSelectedMetric] = useState<"students" | "revenue" | "courses" | "engagement">("students");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [yearlyData, setYearlyData] = useState<MonthlyData>(getYearlyData("2026"));
  const [growthData] = useState<GrowthData>(getGrowthData());
  const [platformMetrics] = useState<PlatformMetrics>(getPlatformMetrics());

  useEffect(() => {
    setYearlyData(getYearlyData(selectedYear));
  }, [selectedYear]);

  const handleRangeChange = (range: "today" | "week" | "month" | "year" | "custom") => {
    setSelectedRange(range);
    const now = new Date();
    
    switch (range) {
      case "today":
        setDateRange({ from: now, to: now });
        break;
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
        setSelectedYear(String(yearAgo.getFullYear()));
        break;
      }
      default:
        break;
    }
  };

  const handleExport = () => {
    alert(`Exporting analytics data for ${selectedRange} range...`);
  };

  const getChartData = () => {
    if (selectedRange === "year") {
      return {
        labels: yearlyData.labels,
        students: yearlyData.students,
        revenue: yearlyData.revenue,
        courses: yearlyData.courses,
        discussions: yearlyData.discussions,
        events: yearlyData.events,
      };
    } else {
      const days = selectedRange === "today" ? 1 : selectedRange === "week" ? 7 : 30;
      const labels = [];
      const students = [];
      const revenue = [];
      const courses = [];
      const discussions = [];
      const events = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        students.push(Math.floor(Math.random() * 100) + 50);
        revenue.push(Math.floor(Math.random() * 50000) + 10000);
        courses.push(Math.floor(Math.random() * 5) + 20);
        discussions.push(Math.floor(Math.random() * 15) + 5);
        events.push(Math.floor(Math.random() * 8) + 2);
      }
      return { labels, students, revenue, courses, discussions, events };
    }
  };

  const chartData = getChartData();

  const getMetricData = () => {
    switch (selectedMetric) {
      case "students":
        return {
          data: chartData.students,
          color: "bg-blue-500",
          label: "New Students",
          format: (v: number) => v.toLocaleString(),
          unit: "students",
        };
      case "revenue":
        return {
          data: chartData.revenue,
          color: "bg-green-500",
          label: "Revenue",
          format: (v: number) => `₱${(v / 1000).toFixed(0)}k`,
          unit: "PHP",
        };
      case "courses":
        return {
          data: chartData.courses,
          color: "bg-purple-500",
          label: "Total Courses",
          format: (v: number) => v.toString(),
          unit: "courses",
        };
      case "engagement":
        return {
          data: chartData.discussions,
          color: "bg-gold",
          label: "Discussions",
          format: (v: number) => v.toString(),
          unit: "posts",
        };
    }
  };

  const metricData = getMetricData();

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-gold" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive platform insights and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
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
              <span>{selectedRange === "today" ? "Today" : selectedRange === "week" ? "Last 7 Days" : selectedRange === "month" ? "Last 30 Days" : `Year ${selectedYear}`}</span>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.users.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.users.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.users.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{platformMetrics.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-blue-600">{platformMetrics.totalLearners.toLocaleString()} learners</span>
                <span className="text-gold">{platformMetrics.totalMentors} mentors</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.courses.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.courses.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.courses.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{platformMetrics.totalCourses}</p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gold">
                <Star className="h-3 w-3 fill-gold" />
                <span>{platformMetrics.averageRating} avg rating</span>
              </div>
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
              <p className="text-2xl font-serif font-bold text-gold">₱{(platformMetrics.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground mt-1">₱{(platformMetrics.totalRevenue * 0.3 / 1000).toFixed(0)}k platform fee</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${growthData.engagement.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {growthData.engagement.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {growthData.engagement.value}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-navy">{platformMetrics.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
              <p className="text-xs text-muted-foreground mt-1">{Math.round((platformMetrics.activeUsers / platformMetrics.totalUsers) * 100)}% engagement rate</p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserPlus className="h-4 w-4 text-green-500" />
              <span className="text-xs">New Users</span>
            </div>
            <p className="text-xl font-bold text-navy mt-1">+{Math.floor(platformMetrics.totalUsers * 0.03).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">this month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-xs">Discussions</span>
            </div>
            <p className="text-xl font-bold text-navy mt-1">{platformMetrics.totalDiscussions}</p>
            <p className="text-xs text-muted-foreground">total posts</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-xs">Events</span>
            </div>
            <p className="text-xl font-bold text-navy mt-1">{platformMetrics.totalEvents}</p>
            <p className="text-xs text-muted-foreground">total events</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flag className="h-4 w-4 text-red-500" />
              <span className="text-xs">Reports</span>
            </div>
            <p className="text-xl font-bold text-red-600 mt-1">{platformMetrics.pendingReports}</p>
            <p className="text-xs text-muted-foreground">pending review</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-gold" />
              <span className="text-xs">Completion Rate</span>
            </div>
            <p className="text-xl font-bold text-navy mt-1">{platformMetrics.completionRate}%</p>
            <p className="text-xs text-muted-foreground">course average</p>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("students")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "students"
                ? "bg-blue-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Student Growth
          </button>
          <button
            onClick={() => setSelectedMetric("revenue")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "revenue"
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-2" />
            Revenue Trend
          </button>
          <button
            onClick={() => setSelectedMetric("courses")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "courses"
                ? "bg-purple-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Course Growth
          </button>
          <button
            onClick={() => setSelectedMetric("engagement")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              selectedMetric === "engagement"
                ? "bg-gold text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Engagement
          </button>
        </div>

        {/* Main Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-serif text-lg font-bold text-navy mb-4">
            {selectedMetric === "students" && "Student Growth Over Time"}
            {selectedMetric === "revenue" && "Revenue Trend"}
            {selectedMetric === "courses" && "Course Growth"}
            {selectedMetric === "engagement" && "Community Engagement"}
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
          <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
            <span>Total {metricData.label.toLowerCase()}: {metricData.format(metricData.data.reduce((a, b) => a + b, 0))}</span>
            <span>Average: {metricData.format(Math.round(metricData.data.reduce((a, b) => a + b, 0) / metricData.data.length))} per period</span>
          </div>
        </div>

        {/* Two Column Layout - Platform Health */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gold" />
              Weekly Platform Activity
            </h3>
            <div className="h-48 flex items-end gap-2">
              {WEEKLY_ACTIVITY.map((value, index) => {
                const height = value;
                let barColor = "bg-blue-500";
                if (value >= 80) barColor = "bg-green-500";
                else if (value >= 60) barColor = "bg-gold";
                else if (value >= 40) barColor = "bg-orange-500";
                else barColor = "bg-red-500";
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full">
                      <div 
                        className={`w-full ${barColor} rounded-t-lg transition-all duration-500 group-hover:opacity-80`}
                        style={{ height: `${height}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value}% activity
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{WEEKLY_LABELS[index]}</span>
                    <span className="text-xs font-semibold text-navy">{value}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
              <Zap className="h-3 w-3 text-gold" />
              Peak activity on Fridays with 92% platform engagement
              <ThumbsUp className="h-3 w-3 text-green-500" />
            </p>
          </div>

          {/* User Distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              User Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Learners</span>
                  <span className="font-semibold">{Math.round((platformMetrics.totalLearners / platformMetrics.totalUsers) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(platformMetrics.totalLearners / platformMetrics.totalUsers) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mentors</span>
                  <span className="font-semibold">{Math.round((platformMetrics.totalMentors / platformMetrics.totalUsers) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(platformMetrics.totalMentors / platformMetrics.totalUsers) * 100}%` }} />
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-green-600">{Math.round((platformMetrics.activeUsers / platformMetrics.totalUsers) * 100)}%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-gold">{platformMetrics.completionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Content Performance
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Metric</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Current</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Growth</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-navy">Course Enrollments</td>
                  <td className="px-6 py-4 text-sm">+{Math.floor(platformMetrics.totalUsers * 0.15).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600 flex items-center gap-1"><ArrowUp className="h-3 w-3" /> +12%</td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Excellent</span></td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-navy">Discussion Posts</td>
                  <td className="px-6 py-4 text-sm">{platformMetrics.totalDiscussions}</td>
                  <td className="px-6 py-4 text-sm text-green-600 flex items-center gap-1"><ArrowUp className="h-3 w-3" /> +8%</td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Good</span></td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-navy">Events Created</td>
                  <td className="px-6 py-4 text-sm">{platformMetrics.totalEvents}</td>
                  <td className="px-6 py-4 text-sm text-green-600 flex items-center gap-1"><ArrowUp className="h-3 w-3" /> +5%</td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Good</span></td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-navy">Content Reports</td>
                  <td className="px-6 py-4 text-sm">{platformMetrics.totalReports}</td>
                  <td className="px-6 py-4 text-sm text-red-600 flex items-center gap-1"><ArrowDown className="h-3 w-3" /> -8%</td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Improving</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Health Indicators */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-navy">Platform Health</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">92%</p>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-gold" />
              </div>
              <h4 className="font-semibold text-navy">User Satisfaction</h4>
            </div>
            <p className="text-2xl font-bold text-gold">{platformMetrics.averageRating}</p>
            <p className="text-xs text-muted-foreground">out of 5.0 stars</p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-3 w-3 ${star <= Math.floor(platformMetrics.averageRating) ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-navy">Response Time</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">245ms</p>
            <p className="text-xs text-muted-foreground">Average API response</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}