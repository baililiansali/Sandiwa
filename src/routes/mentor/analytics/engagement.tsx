import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Activity, Users, Timer, UserCheck, BarChart, 
  ArrowUp, Download, Calendar,
  Zap, ThumbsUp, Clock, CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getEngagementMetrics,
  WEEKLY_LABELS,
  type EngagementMetrics
} from "@/data/mockAnalytics";
import { DateRangePicker } from "@/components/DateRangePicker";

export const Route = createFileRoute("/mentor/analytics/engagement")({
  head: () => ({
    meta: [
      { title: "Student Engagement — Sandiwa Mentor" },
      { name: "description", content: "View student engagement analytics." },
    ],
  }),
  component: EngagementPage,
});

function EngagementPage() {
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "month" | "year" | "custom">("year");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics>(getEngagementMetrics("2026"));

  useEffect(() => {
    setEngagementMetrics(getEngagementMetrics(selectedYear));
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
    alert(`Exporting engagement data for ${selectedRange} range...`);
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Student Engagement</h1>
            <p className="text-muted-foreground mt-1">
              Track how actively students interact with your courses
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Timer className="h-4 w-4" />
              <span className="text-sm">Avg. Time Spent</span>
            </div>
            <p className="text-2xl font-bold text-navy">{engagementMetrics.averageTimeSpent} min</p>
            <p className="text-xs text-muted-foreground mt-1">per day per student</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm">Active Students</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{engagementMetrics.activeStudents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((engagementMetrics.activeStudents / (engagementMetrics.activeStudents + engagementMetrics.inactiveStudents)) * 100)}% of total
            </p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(engagementMetrics.activeStudents / (engagementMetrics.activeStudents + engagementMetrics.inactiveStudents)) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Avg. Lessons Completed</span>
            </div>
            <p className="text-2xl font-bold text-navy">{engagementMetrics.averageLessonsCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">out of ~12 per course</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{ width: `${(engagementMetrics.averageLessonsCompleted / 12) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart className="h-4 w-4" />
              <span className="text-sm">Interaction Rate</span>
            </div>
            <p className="text-2xl font-bold text-gold">{engagementMetrics.interactionRate}%</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{ width: `${engagementMetrics.interactionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-serif text-lg font-bold text-navy mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-end gap-2">
            {engagementMetrics.weeklyActivity.map((value, index) => {
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
            Peak activity on Fridays with {Math.max(...engagementMetrics.weeklyActivity)}% engagement
            <ThumbsUp className="h-3 w-3 text-green-500" />
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium text-navy mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-gold" />
              Engagement Score Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Highly Engaged (80-100%)</span>
                  <span className="font-semibold">42%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Moderately Engaged (60-79%)</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: "35%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Low Engagement (0-59%)</span>
                  <span className="font-semibold">23%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "23%" }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
              <span>Total Students: {(engagementMetrics.activeStudents + engagementMetrics.inactiveStudents).toLocaleString()}</span>
              <span>Avg Score: {engagementMetrics.interactionRate}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium text-navy mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              Time-Based Insights
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-navy">Peak Learning Hours</p>
                <p className="text-2xl font-bold text-gold">7:00 PM - 9:00 PM</p>
                <p className="text-xs text-muted-foreground">Most students active during evening hours</p>
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Most Active Day</p>
                <p className="text-2xl font-bold text-green-600">Friday</p>
                <p className="text-xs text-muted-foreground">{Math.max(...engagementMetrics.weeklyActivity)}% engagement rate</p>
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Average Session Duration</p>
                <p className="text-2xl font-bold text-blue-600">32 minutes</p>
                <p className="text-xs text-muted-foreground">↑ 5 min vs last year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}