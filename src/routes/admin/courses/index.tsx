// src/routes/admin/courses/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, Eye, Trash2, Star, Users, Clock, Edit } from "lucide-react";
import { useState } from "react";
import { courses } from "@/data/mockCourses";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCoursesPage,
});

function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course =>
    (categoryFilter === "all" || course.category === categoryFilter) &&
    (course.title.toLowerCase().includes(search.toLowerCase()) ||
     course.mentor.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue = filteredCourses.reduce((sum, c) => sum + (c.enrolled * c.price), 0);
  const totalStudents = filteredCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const averageRating = filteredCourses.length > 0 
    ? (filteredCourses.reduce((sum, c) => sum + c.rating, 0) / filteredCourses.length).toFixed(1)
    : "0";

  const handleDelete = (courseId: string, courseTitle: string) => {
    if (confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      // In a real app, you would call an API here
      alert(`Course "${courseTitle}" deleted successfully!`);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Manage Courses</h1>
          <p className="text-muted-foreground mt-1">Review and manage all courses on the platform</p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{filteredCourses.length}</p>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{totalStudents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-gold">₱{(totalRevenue / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{averageRating}</p>
            <p className="text-xs text-muted-foreground">Avg. Rating</p>
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
              placeholder="Search courses by title or mentor..."
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

        {/* Courses Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Mentor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt={course.title} className="h-10 w-10 rounded-md object-cover" />
                        <div>
                          <p className="text-sm font-medium text-navy">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{course.mentor}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{course.enrolled.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gold">₱{(course.enrolled * course.price).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to="/learner/courses/courses/$courseId" params={{ courseId: course.id }}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </Link>
                        <Link to="/mentor/courses/manage/$courseId" params={{ courseId: course.id }}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(course.id, course.title)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}