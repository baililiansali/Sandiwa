// src/routes/admin/mentors/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MentorApplication {
  id: number;
  fullName: string;
  email: string;
  expertise: string;
  experience: string;
  bio: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

// Mock applications data
const mockApplications: MentorApplication[] = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@example.com",
    expertise: "Filipino Language",
    experience: "5-10",
    bio: "Passionate language teacher with 8 years of experience teaching Filipino to foreign students.",
    status: "pending",
    appliedAt: "2026-05-01",
    website: "https://johnsmith.com",
    twitter: "@johnsmith",
  },
  {
    id: 2,
    fullName: "Maria Garcia",
    email: "maria.garcia@example.com",
    expertise: "Philippine History",
    experience: "10+",
    bio: "History professor at UP Diliman with PhD in Philippine Studies.",
    status: "pending",
    appliedAt: "2026-04-28",
    linkedin: "linkedin.com/in/mariagarcia",
  },
  {
    id: 3,
    fullName: "Robert Tan",
    email: "robert.tan@example.com",
    expertise: "Arts & Crafts",
    experience: "3-5",
    bio: "Traditional artist specializing in weaving and pottery.",
    status: "pending",
    appliedAt: "2026-04-25",
    website: "https://robertart.com",
  },
  {
    id: 4,
    fullName: "Lisa Wong",
    email: "lisa.wong@example.com",
    expertise: "Filipino Cuisine",
    experience: "5-10",
    bio: "Chef and food writer with 3 cookbooks published.",
    status: "approved",
    appliedAt: "2026-04-20",
  },
  {
    id: 5,
    fullName: "Michael Cruz",
    email: "michael.cruz@example.com",
    expertise: "Music & Dance",
    experience: "1-3",
    bio: "Professional dancer specializing in Tinikling and other folk dances.",
    status: "rejected",
    appliedAt: "2026-04-15",
  },
];

export const Route = createFileRoute("/admin/mentors/")({
  component: AdminMentorsPage,
});

function AdminMentorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<MentorApplication[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);

  const filteredApplications = applications.filter(app =>
    (statusFilter === "all" || app.status === statusFilter) &&
    (app.fullName.toLowerCase().includes(search.toLowerCase()) ||
     app.email.toLowerCase().includes(search.toLowerCase()) ||
     app.expertise.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  const handleApprove = (application: MentorApplication) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );
    toast.success(`${application.fullName} has been approved as a mentor!`);
    setSelectedApplication(null);
  };

  const handleReject = (application: MentorApplication) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === application.id ? { ...app, status: "rejected" } : app
      )
    );
    toast.info(`${application.fullName}'s application has been rejected.`);
    setSelectedApplication(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Mentor Applications</h1>
          <p className="text-muted-foreground mt-1">Review and manage mentor applications</p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or expertise..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-navy">{app.fullName}</p>
                        <p className="text-xs text-muted-foreground">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                        {app.expertise}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{app.experience} years</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-navy">Review Application</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-navy mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <p className="font-medium">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expertise:</span>
                      <p className="font-medium">{selectedApplication.expertise}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-medium">{selectedApplication.experience} years</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-navy mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{selectedApplication.bio}</p>
                </div>

                {/* Social Links */}
                {(selectedApplication.website || selectedApplication.twitter || selectedApplication.linkedin) && (
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Social Links</h3>
                    <div className="flex gap-3">
                      {selectedApplication.website && (
                        <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm">
                          Website
                        </a>
                      )}
                      {selectedApplication.twitter && (
                        <a href={`https://twitter.com/${selectedApplication.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm">
                          Twitter
                        </a>
                      )}
                      {selectedApplication.linkedin && (
                        <a href={`https://${selectedApplication.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedApplication)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve Application
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(selectedApplication)}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}