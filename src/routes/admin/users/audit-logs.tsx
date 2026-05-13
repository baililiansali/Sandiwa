// src/routes/admin/users/audit-logs.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  Search, 
  ArrowLeft,
  FileText,
  UserX,
  UserPlus,
  UserCheck,
  MessageSquare,
  Calendar,
  Edit,
  Filter,
  Download,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/users/audit-logs")({
  component: AuditLogsPage,
});

interface AuditLog {
  id: number;
  action: string;
  userId: number;
  userName: string;
  details: string;
  timestamp: string;
  performedBy: string;
  ipAddress?: string;
}

// Mock audit logs data
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 1, action: "user_suspended", userId: 6, userName: "Spam User", details: "User suspended for violating terms of service - multiple spam reports", timestamp: "2024-03-09 10:15:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 2, action: "user_added", userId: 5, userName: "Pending User", details: "New user registered via signup form", timestamp: "2024-03-08 09:00:00", performedBy: "System", ipAddress: "203.45.67.89" },
  { id: 3, action: "discussion_verified", userId: 1, userName: "Maria Santos", details: "Discussion post 'Filipino Grammar Tips' verified", timestamp: "2024-03-07 16:20:00", performedBy: "mentor.jose@gmail.com", ipAddress: "192.168.1.5" },
  { id: 4, action: "event_verified", userId: 4, userName: "Ana Cruz", details: "Event 'Filipino Cooking Class' verified", timestamp: "2024-03-06 11:45:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 5, action: "user_edited", userId: 2, userName: "John Reyes", details: "User profile information updated (email changed)", timestamp: "2024-03-05 09:30:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 6, action: "user_activated", userId: 9, userName: "Patricia Cruz", details: "User account reactivated after suspension", timestamp: "2024-03-04 14:20:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 7, action: "user_deleted", userId: 11, userName: "Old Account", details: "User account deleted due to inactivity", timestamp: "2024-03-03 10:00:00", performedBy: "System", ipAddress: "203.45.67.89" },
  { id: 8, action: "mentor_approved", userId: 8, userName: "Miguel Santos", details: "Mentor application approved", timestamp: "2024-03-02 15:30:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 9, action: "discussion_verified", userId: 2, userName: "John Reyes", details: "Discussion post 'History Question' verified", timestamp: "2024-03-01 13:15:00", performedBy: "mentor.ana@gmail.com", ipAddress: "192.168.1.8" },
  { id: 10, action: "user_suspended", userId: 7, userName: "Isabella Flores", details: "User suspended - temporary for policy violation", timestamp: "2024-02-28 11:00:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 11, action: "event_verified", userId: 3, userName: "Jose Reyes", details: "Event 'Filipino Cultural Workshop' verified", timestamp: "2024-02-27 09:45:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 12, action: "user_added", userId: 12, userName: "Luis Fernandez", details: "New user registered via signup form", timestamp: "2024-02-26 16:30:00", performedBy: "System", ipAddress: "203.45.67.89" },
  { id: 13, action: "mentor_rejected", userId: 5, userName: "Robert Tan", details: "Mentor application rejected - insufficient experience", timestamp: "2024-02-25 14:00:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 14, action: "user_edited", userId: 4, userName: "Ana Cruz", details: "User profile information updated (bio changed)", timestamp: "2024-02-24 10:15:00", performedBy: "admin@sandiwa.com", ipAddress: "192.168.1.1" },
  { id: 15, action: "discussion_verified", userId: 6, userName: "Carlos Mendoza", details: "Discussion post 'Pronunciation Help' verified", timestamp: "2024-02-23 12:30:00", performedBy: "mentor.jose@gmail.com", ipAddress: "192.168.1.5" },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case "user_suspended":
      return <UserX className="h-4 w-4 text-red-500" />;
    case "user_added":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "user_activated":
      return <UserCheck className="h-4 w-4 text-green-500" />;
    case "user_deleted":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case "user_edited":
      return <Edit className="h-4 w-4 text-blue-500" />;
    case "discussion_verified":
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case "event_verified":
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case "mentor_approved":
      return <UserCheck className="h-4 w-4 text-green-500" />;
    case "mentor_rejected":
      return <UserX className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getActionColor = (action: string) => {
  if (action.includes("suspended") || action.includes("deleted") || action.includes("rejected"))
    return "bg-red-50 text-red-700 border-red-200";
  if (action.includes("added") || action.includes("activated") || action.includes("approved"))
    return "bg-green-50 text-green-700 border-green-200";
  if (action.includes("edited"))
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (action.includes("discussion"))
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (action.includes("event"))
    return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = search === "" || 
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, actionFilter]);

  const actionTypes = [...new Set(auditLogs.map(log => log.action))];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReadableAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Audit Logs</h1>
              <p className="text-muted-foreground mt-1">Track all user management actions and system events</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-navy">{auditLogs.length}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-purple-600">{auditLogs.filter(l => l.action === "discussion_verified").length}</p>
            <p className="text-xs text-muted-foreground">Discussion Verifications</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-orange-600">{auditLogs.filter(l => l.action === "event_verified").length}</p>
            <p className="text-xs text-muted-foreground">Event Verifications</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-red-600">{auditLogs.filter(l => l.action.includes("suspended") || l.action.includes("deleted")).length}</p>
            <p className="text-xs text-muted-foreground">Moderations</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, details, or admin..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[180px]"
          >
            <option value="all">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>
                {getReadableAction(action)}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => {
            setSearch("");
            setActionFilter("all");
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Audit Logs Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Performed By</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(log.action)}`}>
                          {getReadableAction(log.action)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">ID: {log.userId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-md">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-sm">{log.performedBy}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {log.ipAddress || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              showEntries={true}
            />
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}