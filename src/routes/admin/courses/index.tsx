import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  Search, 
  Eye, 
  Trash2, 
  Star, 
  Users, 
  Clock, 
  Edit, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Calendar,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses as mockCourses, type Course } from "@/data/mockCourses";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCoursesPage,
});

interface CourseWithStatus extends Course {
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt?: string;
}

interface CourseFeedback {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

// Mock pending courses (for approval)
const MOCK_PENDING_COURSES: CourseWithStatus[] = [
  {
    ...mockCourses[0],
    id: "pending_course_1",
    title: "Introduction to Philippine Folk Dance",
    mentor: "Ramon Villanueva",
    mentorId: "ramon-villanueva",
    status: "pending",
    submittedAt: "2024-03-20",
    description: "Learn the basics of traditional Filipino folk dances including Tinikling, Pandanggo sa Ilaw, and Cariñosa.",
    lessons: [
      { title: "Introduction to Folk Dance", minutes: 15 },
      { title: "Tinikling Basics", minutes: 30 },
      { title: "Pandanggo sa Ilaw", minutes: 45 },
    ],
    outcomes: ["Master basic folk dance steps", "Understand cultural significance"],
    enrolled: 0,
    rating: 0,
    image: "/images/folk-dance.jpg",
    category: "Arts",
    badge: "Pending Review",
    price: 49.99,
    hours: 15,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
  },
  {
    ...mockCourses[1],
    id: "pending_course_2",
    title: "Advanced Filipino Poetry Analysis",
    mentor: "Maria Santos",
    mentorId: "maria-santos",
    status: "pending",
    submittedAt: "2024-03-19",
    description: "Deep dive into Filipino poetry from the Spanish colonial period to contemporary works.",
    lessons: [
      { title: "Introduction to Filipino Poetry", minutes: 20 },
      { title: "Spanish Colonial Period", minutes: 45 },
    ],
    outcomes: ["Analyze classic Filipino poems", "Understand historical context"],
    enrolled: 0,
    rating: 0,
    image: "/images/poetry.jpg",
    category: "Language",
    badge: "Pending Review",
    price: 59.99,
    hours: 20,
    createdAt: "2024-03-19",
    updatedAt: "2024-03-19",
  },
  {
    ...mockCourses[5],
    id: "pending_course_3",
    title: "Traditional Filipino Instrument Making",
    mentor: "Ana Cruz",
    mentorId: "ana-cruz",
    status: "pending",
    submittedAt: "2024-03-18",
    description: "Learn to create traditional Filipino instruments like the kulintang, banduria, and kubing.",
    lessons: [
      { title: "Introduction to Filipino Instruments", minutes: 30 },
      { title: "Kulintang Assembly", minutes: 60 },
    ],
    outcomes: ["Identify traditional Filipino instruments", "Build a simple kubing instrument"],
    enrolled: 0,
    rating: 0,
    image: "/images/instruments.jpg",
    category: "Arts",
    badge: "Pending Review",
    price: 89.99,
    hours: 25,
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
  },
];

// Mock approved courses
const MOCK_APPROVED_COURSES: CourseWithStatus[] = mockCourses.slice(0, 8).map(course => ({
  ...course,
  status: "approved",
}));

// Mock feedback for courses
const MOCK_FEEDBACK: CourseFeedback[] = [
  { id: "fb1", courseId: "filipino-beginners", courseTitle: "Complete Filipino Language for Beginners", studentName: "Juan Dela Cruz", rating: 5, title: "Excellent course!", comment: "This course really helped me learn Filipino fast.", date: "2024-03-15" },
  { id: "fb2", courseId: "filipino-beginners", courseTitle: "Complete Filipino Language for Beginners", studentName: "Maria Santos", rating: 4, title: "Great but needs more exercises", comment: "Content is good but I wish there were more practice quizzes.", date: "2024-03-14" },
  { id: "fb3", courseId: "philippine-history", courseTitle: "Philippine History and Heritage Masterclass", studentName: "Jose Rizal", rating: 5, title: "Very informative!", comment: "Learned so much about our history.", date: "2024-03-13" },
  { id: "fb4", courseId: "philippine-history", courseTitle: "Philippine History and Heritage Masterclass", studentName: "Anonymous", rating: 2, title: "SPAM", comment: "Buy cheap watches online!!!", date: "2024-03-12" },
  { id: "fb5", courseId: "filipino-cuisine-basics", courseTitle: "Authentic Filipino Cuisine", studentName: "Carlos Lopez", rating: 5, title: "Delicious recipes!", comment: "My adobo turned out perfect!", date: "2024-03-11" },
];

function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"courses" | "pending" | "feedback">("courses");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStatus | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<CourseFeedback | null>(null);
  const [pendingCourses, setPendingCourses] = useState<CourseWithStatus[]>(MOCK_PENDING_COURSES);
  const [approvedCourses, setApprovedCourses] = useState<CourseWithStatus[]>(MOCK_APPROVED_COURSES);
  const [feedback, setFeedback] = useState<CourseFeedback[]>(MOCK_FEEDBACK);
  const itemsPerPage = 5;

  const categories = ["all", ...Array.from(new Set(mockCourses.map(c => c.category)))];

  // Filter courses based on search and category
  const filteredCourses = approvedCourses.filter(course =>
    (categoryFilter === "all" || course.category === categoryFilter) &&
    (course.title.toLowerCase().includes(search.toLowerCase()) ||
     course.mentor.toLowerCase().includes(search.toLowerCase()))
  );

  // Filter pending courses
  const filteredPendingCourses = pendingCourses.filter(course =>
    (categoryFilter === "all" || course.category === categoryFilter) &&
    (course.title.toLowerCase().includes(search.toLowerCase()) ||
     course.mentor.toLowerCase().includes(search.toLowerCase()))
  );

  // Filter feedback
  const filteredFeedback = feedback.filter(fb =>
    fb.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
    fb.studentName.toLowerCase().includes(search.toLowerCase()) ||
    fb.comment.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedPendingCourses = filteredPendingCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, activeTab]);

  const totalRevenue = approvedCourses.reduce((sum, c) => sum + (c.enrolled * c.price), 0);
  const totalStudents = approvedCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const averageRating = approvedCourses.length > 0 
    ? (approvedCourses.reduce((sum, c) => sum + c.rating, 0) / approvedCourses.length).toFixed(1)
    : "0";

  const stats = {
    totalCourses: approvedCourses.length,
    totalStudents: totalStudents,
    totalRevenue: totalRevenue,
    averageRating: averageRating,
    pendingApproval: pendingCourses.length,
  };

  const handleApproveCourse = (course: CourseWithStatus) => {
    setPendingCourses(pendingCourses.filter(c => c.id !== course.id));
    setApprovedCourses([...approvedCourses, { ...course, status: "approved" }]);
    toast.success(`Course "${course.title}" has been approved!`);
    setSelectedCourse(null);
  };

  const handleRejectCourse = (course: CourseWithStatus) => {
    setPendingCourses(pendingCourses.filter(c => c.id !== course.id));
    toast.info(`Course "${course.title}" has been rejected.`);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (course: CourseWithStatus) => {
    if (confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      setApprovedCourses(approvedCourses.filter(c => c.id !== course.id));
      toast.success(`Course "${course.title}" deleted successfully!`);
    }
  };

  const handleDeleteFeedback = (feedbackItem: CourseFeedback) => {
    if (confirm(`Delete feedback from ${feedbackItem.studentName}?`)) {
      setFeedback(feedback.filter(f => f.id !== feedbackItem.id));
      toast.success("Feedback deleted");
      setSelectedFeedback(null);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Course Management</h1>
          <p className="text-muted-foreground mt-1">Manage courses, approve pending courses, and moderate feedback</p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("courses")}>
            <p className="text-2xl font-bold text-navy">{stats.totalCourses}</p>
            <p className="text-xs text-muted-foreground">Published Courses</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-blue-600">{stats.totalStudents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-gold">₱{(stats.totalRevenue / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("pending")}>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingApproval}</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab("courses")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "courses" 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Published Courses
              <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {stats.totalCourses}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "pending" 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending Approval
              {stats.pendingApproval > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {stats.pendingApproval}
                </span>
              )}
            </button>
            {/* <button
              onClick={() => setActiveTab("feedback")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "feedback" 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Feedback Management
            </button> */}
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "feedback" ? "Search by course, student, or comment..." : "Search by title or mentor..."}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>

        {/* Published Courses Table */}
        {activeTab === "courses" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mentor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-navy">{course.title}</p>
                          <p className="text-xs text-muted-foreground">ID: {course.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{course.mentor}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{course.enrolled.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gold">₱{(course.enrolled * course.price).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-gold text-gold" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Link to="/admin/courses/$courseId" params={{ courseId: course.id }}>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="View Course">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link 
                            to="/admin/courses/edit" 
                            search={{ courseId: course.id }}
                          >
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600" title="Edit Course"> 
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDeleteCourse(course)}
                            title="Delete Course"
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
            <div className="px-4 py-3 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredCourses.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          </div>
        )}

        {/* Pending Courses Table */}
        {activeTab === "pending" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mentor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedPendingCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-navy">{course.title}</p>
                          <p className="text-xs text-muted-foreground">ID: {course.id}</p>
                        </div>
                       </td>
                      <td className="px-4 py-3 text-sm">{course.mentor}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                          {course.category}
                        </span>
                       </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{course.submittedAt || "2024-03-01"}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₱{course.price}</td>
                      <td className="px-4 py-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> Review
                        </Button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredPendingCourses.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          </div>
        )}

        {/* Review Course Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border sticky top-0 bg-background">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-navy">Review Course</h2>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-navy mb-3 text-lg">Course Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Course Title:</span>
                      <p className="font-medium mt-1">{selectedCourse.title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mentor:</span>
                      <p className="font-medium mt-1">{selectedCourse.mentor}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium mt-1">{selectedCourse.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium mt-1">₱{selectedCourse.price}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hours:</span>
                      <p className="font-medium mt-1">{selectedCourse.hours} hours</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lessons:</span>
                      <p className="font-medium mt-1">{selectedCourse.lessons.length} lessons</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <p className="font-medium mt-1">{selectedCourse.submittedAt}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-navy mb-3 text-lg">Description</h3>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-navy mb-3 text-lg">What You'll Learn</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedCourse.outcomes.slice(0, 6).map((outcome, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-navy mb-3 text-lg">Course Content Preview</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCourse.lessons.map((lesson, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{lesson.minutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApproveCourse(selectedCourse)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Course
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleRejectCourse(selectedCourse)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Management Table */}
        {/* {activeTab === "feedback" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Feedback</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedFeedback.map((fb) => (
                    <tr key={fb.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{fb.courseTitle}</td>
                      <td className="px-4 py-3 text-sm">{fb.studentName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-gold text-gold" />
                          <span className="text-sm">{fb.rating}</span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <p className="text-sm max-w-xs line-clamp-2">{fb.comment}</p>
                       </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{fb.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedFeedback(fb)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDeleteFeedback(fb)}
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
            <div className="px-4 py-3 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredFeedback.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          </div>
        )} */}

        {/* Feedback Detail Modal */}
        {/* {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-lg w-full">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-navy">Feedback Details</h2>
                <button onClick={() => setSelectedFeedback(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Course</label>
                  <p className="font-medium">{selectedFeedback.courseTitle}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Student</label>
                  <p>{selectedFeedback.studentName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Rating</label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`h-4 w-4 ${star <= selectedFeedback.rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <p className="font-medium">{selectedFeedback.title}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Comment</label>
                  <div className="p-3 bg-muted/20 rounded-lg mt-1">
                    <p className="text-sm">{selectedFeedback.comment}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteFeedback(selectedFeedback)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Feedback
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {activeTab === "courses" && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}

        {activeTab === "pending" && filteredPendingCourses.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-muted-foreground">No pending courses to review.</p>
          </div>
        )}

        {activeTab === "feedback" && filteredFeedback.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No feedback found.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}