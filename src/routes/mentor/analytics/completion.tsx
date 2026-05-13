import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Award, CheckCircle, TrendingUp, Target, XCircle,
  Download, Calendar,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCompletionMetrics, type CompletionMetrics } from "@/data/mockAnalytics";
import { DateRangePicker } from "@/components/DateRangePicker";

export const Route = createFileRoute("/mentor/analytics/completion")({
  head: () => ({
    meta: [
      { title: "Completion Rates — Sandiwa Mentor" },
      { name: "description", content: "View course completion analytics." },
    ],
  }),
  component: CompletionPage,
});

function CompletionPage() {
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "month" | "year" | "custom">("year");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [completionMetrics, setCompletionMetrics] = useState<CompletionMetrics>(getCompletionMetrics("2026"));

  useEffect(() => {
    setCompletionMetrics(getCompletionMetrics(selectedYear));
  }, [selectedYear]);

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
        setSelectedYear(String(yearAgo.getFullYear()));
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleExport = () => {
    alert(`Exporting completion data for ${selectedRange} range...`);
  };

  const totalStudents = completionMetrics.byCourse.reduce((sum, c) => sum + c.totalStudents, 0);
  const completionDistribution = [
    { label: "Completed", value: completionMetrics.overall, color: "bg-green-500" },
    { label: "In Progress", value: Math.max(0, 100 - completionMetrics.overall - Math.round((completionMetrics.droppedOut / totalStudents) * 100)), color: "bg-gold" },
    { label: "Dropped Out", value: Math.round((completionMetrics.droppedOut / totalStudents) * 100), color: "bg-red-500" },
  ];

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Completion Rates</h1>
            <p className="text-muted-foreground mt-1">
              Track how many students complete your courses
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
              onChange={(range) => {
                setDateRange(range);
                setSelectedYear(String(range.from.getFullYear()));
              }}
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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-green-500 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    style={{
                      strokeDasharray: 351.86,
                      strokeDashoffset: 351.86 * (1 - completionMetrics.overall / 100),
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                    }}
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-green-600">{completionMetrics.overall}%</span>
              </div>
              <p className="text-sm font-medium text-navy mt-2">Overall Completion Rate</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              {completionDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gold" />
                  <span className="text-sm text-muted-foreground">Certificates Issued</span>
                </div>
                <span className="text-2xl font-bold text-navy">{completionMetrics.certificateIssued.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Dropped Out</span>
                </div>
                <span className="text-2xl font-bold text-red-500">{completionMetrics.droppedOut.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Students</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {totalStudents.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-navy">Course Completion Rates</h4>
            </div>
            <div className="space-y-3">
              {completionMetrics.byCourse.map((course, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="truncate flex-1">{course.courseTitle.length > 30 ? course.courseTitle.substring(0, 30) + "..." : course.courseTitle}</span>
                    <span className="font-semibold">{course.rate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${course.rate >= 80 ? 'bg-green-500' : course.rate >= 60 ? 'bg-gold' : 'bg-orange-500'}`}
                      style={{ width: `${course.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-navy">Completion Rates by Course</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Completed Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Total Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Completion Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Certificates Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completionMetrics.byCourse.map((course) => (
                  <tr key={course.courseId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-navy">{course.courseTitle}</td>
                    <td className="px-6 py-4 text-sm">{course.completedStudents.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{course.totalStudents.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gold" style={{ width: `${course.rate}%` }} />
                        </div>
                        <span className="text-xs font-medium">{course.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course.rate >= 80 ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" /> Excellent
                        </span>
                      ) : course.rate >= 60 ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <TrendingUp className="h-3 w-3" /> Good
                        </span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <Target className="h-3 w-3" /> Needs Improvement
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {Math.floor(course.completedStudents * 0.95).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Excellent (80-100%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span>Good (60-79%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Needs Improvement (&lt;60%)</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Certificates Issued: {completionMetrics.certificateIssued.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}