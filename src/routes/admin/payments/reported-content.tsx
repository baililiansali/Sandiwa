// src/routes/admin/payments/reported-content.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Flag, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2,
  MessageSquare,
  BookOpen,
  User,
  ArrowLeft,
  Search,
  Ban
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/payments/reported-content")({
  component: ReportedContentPage,
});

interface ReportedContent {
  id: number;
  type: "course" | "review" | "comment";
  title: string;
  content?: string;
  reporter: string;
  reporterId: string;
  reportedUser: string;
  reportedUserId: string;
  reason: string;
  description: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  priority: "high" | "medium" | "low";
}

function ReportedContentPage() {
  const router = useRouter();
  
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    { 
      id: 1, 
      type: "course", 
      title: "Philippine History 101", 
      reporter: "Maria Santos", 
      reporterId: "student_789",
      reportedUser: "John Smith",
      reportedUserId: "mentor_123",
      reason: "Inaccurate historical information", 
      description: "The course contains several inaccurate historical claims about the Philippine Revolution. Specifically, it incorrectly states dates and misrepresents key figures.",
      date: "2026-05-13", 
      status: "pending",
      priority: "high"
    },
    { 
      id: 2, 
      type: "review", 
      title: "Review on 'Filipino Cooking Class'", 
      content: "This course is terrible. The instructor doesn't know what they're talking about.",
      reporter: "Jose Rizal", 
      reporterId: "student_456",
      reportedUser: "Maria Garcia",
      reportedUserId: "mentor_234",
      reason: "Harassment", 
      description: "The review contains offensive language and personal attacks against the instructor.",
      date: "2026-05-12", 
      status: "pending",
      priority: "medium"
    },
    { 
      id: 3, 
      type: "comment", 
      title: "Comment on 'Basic Tagalog'", 
      content: "This is spam promoting a different website.",
      reporter: "Ana Reyes", 
      reporterId: "student_123",
      reportedUser: "SpamUser",
      reportedUserId: "user_999",
      reason: "Spam", 
      description: "Comment contains links to external commercial website not related to the course.",
      date: "2026-05-11", 
      status: "pending",
      priority: "low"
    },
    { 
      id: 4, 
      type: "course", 
      title: "Advanced Tagalog", 
      reporter: "Carlos Lopez", 
      reporterId: "student_321",
      reportedUser: "Maria Garcia",
      reportedUserId: "mentor_234",
      reason: "Copyright violation", 
      description: "This course uses copyrighted materials without permission, including images and text from a published book.",
      date: "2026-05-10", 
      status: "pending", 
      priority: "high"
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
      case 'action_taken': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'review': return <MessageSquare className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const filteredReports = reportedContent.filter(report => {
    const matchesStatus = filterStatus === "all" ? true : report.status === filterStatus;
    const matchesType = filterType === "all" ? true : report.type === filterType;
    const matchesPriority = filterPriority === "all" ? true : report.priority === filterPriority;
    const matchesSearch = searchTerm === "" || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });

  const pendingCount = reportedContent.filter(r => r.status === "pending").length;
  const highPriorityCount = reportedContent.filter(r => r.priority === "high" && r.status === "pending").length;

  const handleDismissReport = (id: number) => {
    setReportedContent(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status: "dismissed" } : report
      )
    );
    alert(`Report #${id} has been dismissed. No action will be taken against the user.`);
    setSelectedReport(null);
  };

  const handleWarning = (id: number) => {
    setReportedContent(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status: "action_taken" } : report
      )
    );
    alert(`Warning issued to user for report #${id}. User has been notified.`);
    setSelectedReport(null);
  };

  const handleRemoveContent = (id: number) => {
    setReportedContent(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status: "action_taken" } : report
      )
    );
    alert(`Content has been removed for report #${id}. User has been notified.`);
    setSelectedReport(null);
  };

  const handleSuspendUser = (id: number) => {
    setReportedContent(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status: "action_taken" } : report
      )
    );
    alert(`User has been suspended for report #${id}. Admin review required for reinstatement.`);
    setSelectedReport(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <AdminDashboardLayout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-2xl font-bold text-navy">Reported Content</h1>
              <p className="text-sm text-muted-foreground">Review and moderate content reported by users</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilterStatus("all");
                setFilterType("all");
                setFilterPriority("all");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Summary Stats - Compact */}
        <div className="grid gap-3 grid-cols-4 mb-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <Flag className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-serif font-bold mt-1">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Reports</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-serif font-bold mt-1">{highPriorityCount}</p>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-serif font-bold mt-1">{reportedContent.filter(r => r.status === "action_taken").length}</p>
            <p className="text-xs text-muted-foreground">Actions Taken</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-serif font-bold mt-1">{reportedContent.filter(r => r.status === "reviewed").length}</p>
            <p className="text-xs text-muted-foreground">Reviewed</p>
          </div>
        </div>

        {/* Filters - Compact */}
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[180px]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="action_taken">Action Taken</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="review">Reviews</option>
                <option value="comment">Comments</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table - Compact */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Content</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Reporter</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Reported User</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Reason</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(report.type)}
                        <span className="text-xs capitalize">{report.type}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium max-w-[180px] truncate">{report.title}</p>
                    </td>
                    <td className="px-3 py-2 text-xs">{report.reporter}</td>
                    <td className="px-3 py-2 text-xs text-red-600">{report.reportedUser}</td>
                    <td className="px-3 py-2 text-xs max-w-[120px] truncate">{report.reason}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{formatDate(report.date)}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-navy">No Reports Found</h3>
              <p className="text-xs text-muted-foreground">All clear! No matching content reports.</p>
            </div>
          )}
        </div>

        {/* Detailed Review Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedReport(null)}>
            <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex justify-between items-center sticky top-0 bg-card">
                <h2 className="font-serif text-lg font-bold text-navy">Review Report #{selectedReport.id}</h2>
                <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-accent rounded">
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <p className="text-sm capitalize flex items-center gap-1.5 mt-0.5">
                      {getTypeIcon(selectedReport.type)}
                      {selectedReport.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Priority</label>
                    <p className={`text-xs mt-0.5 inline-block px-2 py-0.5 rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Reported Content</label>
                    <p className="text-sm font-medium mt-0.5">{selectedReport.title}</p>
                    {selectedReport.content && (
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedReport.content}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Reported User</label>
                    <p className="text-sm text-red-600 mt-0.5">{selectedReport.reportedUser}</p>
                    <p className="text-xs text-muted-foreground">ID: {selectedReport.reportedUserId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Reporter</label>
                    <p className="text-sm mt-0.5">{selectedReport.reporter}</p>
                    <p className="text-xs text-muted-foreground">ID: {selectedReport.reporterId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Date Reported</label>
                    <p className="text-sm mt-0.5">{formatDate(selectedReport.date)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Reason</label>
                  <p className="text-sm mt-0.5">{selectedReport.reason}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-0.5 p-2.5 bg-muted/20 rounded-md">{selectedReport.description}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Action</label>
                  <div className="flex gap-2 justify-end flex-wrap">
                    {selectedReport.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-500"
                          onClick={() => {
                            handleDismissReport(selectedReport.id);
                            setSelectedReport(null);
                          }}
                        >
                          Dismiss Report
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                          onClick={() => {
                            handleWarning(selectedReport.id);
                            setSelectedReport(null);
                          }}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Issue Warning
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          onClick={() => {
                            handleRemoveContent(selectedReport.id);
                            setSelectedReport(null);
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove Content
                        </Button>
                        
                        <Button 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            handleSuspendUser(selectedReport.id);
                            setSelectedReport(null);
                          }}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Suspend User
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guidelines - Compact */}
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">Moderation Guidelines</h4>
          <div className="text-xs text-blue-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>• Dismiss: Report is false/spam</span>
            <span>• Warning: Minor first offense</span>
            <span>• Remove Content: Valid report about content</span>
            <span>• Suspend User: Repeated/severe violations</span>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}