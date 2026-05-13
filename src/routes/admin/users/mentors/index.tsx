import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Edit, 
  Trash2, 
  UserX, 
  UserCheck,
  Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users/mentors/")({
  component: AdminMentorsPage,
});

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
  portfolio?: string;
}

interface Mentor {
  id: number;
  name: string;
  email: string;
  expertise: string;
  status: "active" | "suspended";
  joined: string;
  lastActive: string;
  coursesTaught: number;
  rating: number;
  studentsEnrolled: number;
  eventsVerified: number;
}

// Mock applications data
const mockApplications: MentorApplication[] = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@example.com",
    expertise: "Filipino Language",
    experience: "5-10",
    bio: "Passionate language teacher with 8 years of experience teaching Filipino to foreign students. I specialize in conversational Filipino and have taught over 500 students online.",
    status: "pending",
    appliedAt: "2026-05-01",
    website: "https://johnsmith.com",
    twitter: "@johnsmith",
    portfolio: "https://johnsmith.com/portfolio",
  },
  {
    id: 2,
    fullName: "Maria Garcia",
    email: "maria.garcia@example.com",
    expertise: "Philippine History",
    experience: "10+",
    bio: "History professor at UP Diliman with PhD in Philippine Studies. Author of 3 books on Philippine history.",
    status: "pending",
    appliedAt: "2026-04-28",
    linkedin: "linkedin.com/in/mariagarcia",
    portfolio: "https://mariagarcia.com",
  },
  {
    id: 3,
    fullName: "Robert Tan",
    email: "robert.tan@example.com",
    expertise: "Arts & Crafts",
    experience: "3-5",
    bio: "Traditional artist specializing in weaving and pottery. I have conducted workshops in various communities.",
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
    bio: "Chef and food writer with 3 cookbooks published. I want to share Filipino recipes and cooking techniques.",
    status: "approved",
    appliedAt: "2026-04-20",
  },
  {
    id: 5,
    fullName: "Michael Cruz",
    email: "michael.cruz@example.com",
    expertise: "Music & Dance",
    experience: "1-3",
    bio: "Professional dancer specializing in Tinikling and other folk dances. I have performed nationally.",
    status: "rejected",
    appliedAt: "2026-04-15",
  },
];

// Mock mentors data (approved mentors)
const mockMentors: Mentor[] = [
  {
    id: 3,
    name: "Jose Reyes",
    email: "mentor.jose@gmail.com",
    expertise: "Philippine History",
    status: "active",
    joined: "2024-01-05",
    lastActive: "2024-03-15",
    coursesTaught: 3,
    rating: 4.8,
    studentsEnrolled: 1250,
    eventsVerified: 8,
  },
  {
    id: 4,
    name: "Ana Cruz",
    email: "mentor.ana@gmail.com",
    expertise: "Arts & Crafts",
    status: "active",
    joined: "2024-01-20",
    lastActive: "2024-03-13",
    coursesTaught: 2,
    rating: 4.7,
    studentsEnrolled: 890,
    eventsVerified: 5,
  },
  {
    id: 8,
    name: "Miguel Santos",
    email: "miguel@example.com",
    expertise: "Digital Arts",
    status: "active",
    joined: "2024-01-10",
    lastActive: "2024-03-10",
    coursesTaught: 4,
    rating: 4.9,
    studentsEnrolled: 2100,
    eventsVerified: 12,
  },
  {
    id: 10,
    name: "Ramon Villanueva",
    email: "ramon@example.com",
    expertise: "Music & Dance",
    status: "suspended",
    joined: "2024-01-08",
    lastActive: "2024-02-28",
    coursesTaught: 5,
    rating: 4.6,
    studentsEnrolled: 980,
    eventsVerified: 4,
  },
];

function AdminMentorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<MentorApplication[]>(mockApplications);
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [activeTab, setActiveTab] = useState<"applications" | "mentors">("applications");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditMentorModal, setShowEditMentorModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const itemsPerPage = 5;

  // Filter applications
  const filteredApplications = applications.filter(app =>
    (statusFilter === "all" || app.status === statusFilter) &&
    (app.fullName.toLowerCase().includes(search.toLowerCase()) ||
     app.email.toLowerCase().includes(search.toLowerCase()) ||
     app.expertise.toLowerCase().includes(search.toLowerCase()))
  );

  // Filter mentors
  const filteredMentors = mentors.filter(mentor =>
    (statusFilter === "all" || mentor.status === statusFilter) &&
    (mentor.name.toLowerCase().includes(search.toLowerCase()) ||
     mentor.email.toLowerCase().includes(search.toLowerCase()) ||
     mentor.expertise.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedMentors = filteredMentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, activeTab]);

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === "pending").length,
    approvedApplications: applications.filter(a => a.status === "approved").length,
    rejectedApplications: applications.filter(a => a.status === "rejected").length,
    totalMentors: mentors.length,
    activeMentors: mentors.filter(m => m.status === "active").length,
    suspendedMentors: mentors.filter(m => m.status === "suspended").length,
  };

  const handleApprove = (application: MentorApplication) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );
    // Add to mentors list
    const newMentor: Mentor = {
      id: Date.now(),
      name: application.fullName,
      email: application.email,
      expertise: application.expertise,
      status: "active",
      joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      coursesTaught: 0,
      rating: 0,
      studentsEnrolled: 0,
      eventsVerified: 0,
    };
    setMentors(prev => [...prev, newMentor]);
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

  const handleEditMentor = () => {
    if (!editingMentor) return;
    setMentors(mentors.map(m => m.id === editingMentor.id ? editingMentor : m));
    setShowEditMentorModal(false);
    setEditingMentor(null);
    toast.success(`Mentor ${editingMentor.name} updated successfully`);
  };

  const handleSuspendMentor = (mentor: Mentor) => {
    const newStatus = mentor.status === "active" ? "suspended" : "active";
    setMentors(mentors.map(m => 
      m.id === mentor.id ? { ...m, status: newStatus } : m
    ));
    toast.success(`${mentor.name} ${newStatus === "suspended" ? "suspended" : "activated"}`);
  };

  const handleDeleteMentor = (mentor: Mentor) => {
    if (confirm(`Are you sure you want to delete ${mentor.name}? This action cannot be undone.`)) {
      setMentors(mentors.filter(m => m.id !== mentor.id));
      toast.success(`Mentor ${mentor.name} deleted successfully`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
      case "approved":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
      case "active":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Active</span>;
      case "suspended":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Suspended</span>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin/users" className="hover:text-red-600 transition-colors">
              User Management
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Mentor Management</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Mentor Management</h1>
            <p className="text-muted-foreground mt-1">Review mentor applications and manage existing mentors</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-6 mb-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-navy">{stats.totalApplications}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-blue-600">{stats.totalMentors}</p>
            <p className="text-xs text-muted-foreground">Total Mentors</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-green-600">{stats.activeMentors}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-red-600">{stats.suspendedMentors}</p>
            <p className="text-xs text-muted-foreground">Suspended</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab("mentors");
                setStatusFilter("all");
                setSearch("");
              }}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "mentors" 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mentors
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {stats.totalMentors}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("applications");
                setStatusFilter("all");
                setSearch("");
              }}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "applications" 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mentor Applications
              {stats.pendingApplications > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {stats.pendingApplications}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "applications" ? "Search by name, email, or expertise..." : "Search by mentor name, email, or expertise..."}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            {activeTab === "applications" ? (
              <>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </>
            ) : (
              <>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </>
            )}
          </select>
        </div>

        {/* Applications Table */}
        {activeTab === "applications" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Expertise</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Applied</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedApplications.map((app) => (
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
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredApplications.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          </div>
        )}

        {/* Mentors Table */}
        {activeTab === "mentors" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Expertise</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Courses</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedMentors.map((mentor) => (
                    <tr key={mentor.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-navy">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                          {mentor.expertise}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-sm">{mentor.coursesTaught}</td>
                      <td className="px-6 py-4 text-sm">{mentor.rating} ⭐</td>
                      <td className="px-6 py-4 text-sm">{mentor.studentsEnrolled.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(mentor.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedMentor(mentor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-blue-600"
                            onClick={() => {
                              setEditingMentor(mentor);
                              setShowEditMentorModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-yellow-600"
                            onClick={() => handleSuspendMentor(mentor)}
                          >
                            {mentor.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDeleteMentor(mentor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredMentors.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          </div>
        )}

        {/* Review Application Modal */}
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

                {selectedApplication.portfolio && (
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Portfolio</h3>
                    <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm">
                      View Portfolio →
                    </a>
                  </div>
                )}

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
                    disabled={selectedApplication.status !== "pending"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve Application
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(selectedApplication)}
                    disabled={selectedApplication.status !== "pending"}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentor Detail Modal */}
        {selectedMentor && !showEditMentorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-navy">Mentor Details</h2>
                <button onClick={() => setSelectedMentor(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground">Name</label><p className="font-medium">{selectedMentor.name}</p></div>
                  <div><label className="text-xs text-muted-foreground">Email</label><p>{selectedMentor.email}</p></div>
                  <div><label className="text-xs text-muted-foreground">Expertise</label><p>{selectedMentor.expertise}</p></div>
                  <div><label className="text-xs text-muted-foreground">Status</label><p className="capitalize">{selectedMentor.status}</p></div>
                  <div><label className="text-xs text-muted-foreground">Joined</label><p>{selectedMentor.joined}</p></div>
                  <div><label className="text-xs text-muted-foreground">Last Active</label><p>{selectedMentor.lastActive}</p></div>
                  <div><label className="text-xs text-muted-foreground">Courses Taught</label><p>{selectedMentor.coursesTaught}</p></div>
                  <div><label className="text-xs text-muted-foreground">Rating</label><p>{selectedMentor.rating} ⭐</p></div>
                  <div><label className="text-xs text-muted-foreground">Students Enrolled</label><p>{selectedMentor.studentsEnrolled.toLocaleString()}</p></div>
                  <div><label className="text-xs text-muted-foreground">Events Verified</label><p>{selectedMentor.eventsVerified}</p></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mentor Modal */}
        {showEditMentorModal && editingMentor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-border">
                <h2 className="font-serif text-xl font-bold text-navy">Edit Mentor</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={editingMentor.name}
                    onChange={(e) => setEditingMentor({ ...editingMentor, name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editingMentor.email}
                    onChange={(e) => setEditingMentor({ ...editingMentor, email: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expertise</label>
                  <input
                    type="text"
                    value={editingMentor.expertise}
                    onChange={(e) => setEditingMentor({ ...editingMentor, expertise: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditMentorModal(false)}>Cancel</Button>
                <Button onClick={handleEditMentor} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications found matching your criteria.</p>
          </div>
        )}

        {activeTab === "mentors" && filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mentors found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}