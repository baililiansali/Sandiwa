import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, Star, Filter, Download } from "lucide-react";
import { useState } from "react";
import { MOCK_STUDENTS, COURSES, type Student } from "@/data/mockStudents";
import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/mentor/students/")({
  head: () => ({
    meta: [
      { title: "My Students — Sandiwa Mentor" },
      { name: "description", content: "View and manage your students." },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const itemsPerPageOptions = [5, 10, 15, 20, 25, 50];

  const getCoursesWithCounts = () => {
    return COURSES.map(course => {
      const studentCount = students.filter(student => 
        student.enrolledCourses.includes(course.id)
      ).length;
      return {
        id: course.id,
        title: course.title,
        studentCount,
      };
    });
  };

  const coursesWithCounts = getCoursesWithCounts();

  const filtered = students.filter((student: Student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.email.toLowerCase().includes(search.toLowerCase());
    let matchesCourse = true;
    if (selectedCourse !== "all") {
      matchesCourse = student.enrolledCourses.includes(selectedCourse);
    }
    return matchesSearch && matchesCourse;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newSearch: string, newCourse: string) => {
    setSearch(newSearch);
    setSelectedCourse(newCourse);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalStudents = students.length;
  const totalEnrollments = students.reduce((sum, s) => sum + s.coursesCount, 0);
  const avgProgress = students.length > 0 
    ? Math.floor(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0;
  const avgRating = students.length > 0 
    ? (students.reduce((sum, s) => sum + parseFloat(s.rating), 0) / students.length).toFixed(1)
    : "0";

  const getCourseName = (courseId: string): string => {
    const course = COURSES.find(c => c.id === courseId);
    return course?.title || courseId;
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Courses", "Progress", "Rating", "Last Active"];
    const csvData = students.map(s => [
      s.name,
      s.email,
      s.coursesCount,
      s.progress,
      s.rating,
      s.lastActive
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">My Students</h1>
            <p className="text-muted-foreground mt-1">View and manage your enrolled students</p>
          </div>
          <Button variant="outline" className="bg-gold hover:bg-gold/90 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold text-navy">{totalStudents}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold text-navy">{totalEnrollments}</p>
            <p className="text-xs text-muted-foreground">Total Enrollments</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold text-navy">{avgProgress}%</p>
            <p className="text-xs text-muted-foreground">Avg. Completion Rate</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold text-navy">{avgRating}</p>
            <p className="text-xs text-muted-foreground">Avg. Student Rating</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(e.target.value, selectedCourse)}
              placeholder="Search students by name or email..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => handleFilterChange(search, e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer min-w-[220px]"
            >
              <option value="all">All Courses ({totalStudents} students)</option>
              {coursesWithCounts.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.studentCount} students)
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Active Filter Indicator */}
        {selectedCourse !== "all" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Filtering by:</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gold/10 text-gold-dark">
              {getCourseName(selectedCourse)}
              <button
                onClick={() => handleFilterChange(search, "all")}
                className="ml-1 hover:text-gold"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* Students Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Enrolled Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedStudents.map((student: Student) => (
                  <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-navy">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.enrolledCourseTitles.map((courseTitle, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gold/10 text-gold-dark font-medium"
                          >
                            {courseTitle.length > 25 ? courseTitle.substring(0, 22) + "..." : courseTitle}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{student.coursesCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${student.progress}%`,
                              background: student.progress === 100 ? '#10b981' : '#c9a03d'
                            }} 
                          />
                        </div>
                        <span className="text-xs font-medium">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-sm">{student.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.lastActive}</td>
                    <td className="px-6 py-4">
                      <Link to="/mentor/students/$studentId" params={{ studentId: student.id }}>
                        <Button size="sm" variant="outline" className="hover:bg-gold hover:text-white transition-colors">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No students found matching your search or filter criteria.</p>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>
                        {option} per page
                      </option>
                    ))}
                  </select>
                </div>
                
                <Pagination
                  currentPage={currentPage}
                  totalItems={filtered.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  showEntries={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}