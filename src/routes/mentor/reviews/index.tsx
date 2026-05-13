// src/routes/mentor/reviews/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { courses } from "@/data/mockCourses";
import { getReviewsByCourseId, type Review } from "@/data/mockReviews";

// Define the extended review type with course info
interface CourseReview extends Review {
  courseTitle: string;
  courseId: string;
}

export const Route = createFileRoute("/mentor/reviews/")({
  head: () => ({
    meta: [
      { title: "Course Reviews — Sandiwa Mentor" },
      { name: "description", content: "Manage and respond to student reviews." },
    ],
  }),
  component: MentorReviewsPage,
});

function MentorReviewsPage() {
  const [search, setSearch] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [allReviews, setAllReviews] = useState<CourseReview[]>([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    setMentorEmail(email);
    
    // Get mentor's courses
    const mentorCourses = courses.filter(course => course.mentorEmail === email);
    
    // Get all reviews for mentor's courses
    const reviews: CourseReview[] = mentorCourses.flatMap(course => {
      const courseReviews = getReviewsByCourseId(course.id);
      return courseReviews.map(review => ({
        ...review,
        courseTitle: course.title,
        courseId: course.id,
      }));
    });
    
    setAllReviews(reviews);
  }, []);

  const filteredReviews = allReviews.filter((review: CourseReview) =>
    review.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
    review.user.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: allReviews.length,
    averageRating: allReviews.length > 0
      ? (allReviews.reduce((sum: number, r: CourseReview) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : "0",
    responded: allReviews.filter((r: CourseReview) => r.replies.length > 0).length,
    pending: allReviews.filter((r: CourseReview) => r.replies.length === 0).length,
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Course Reviews</h1>
          <p className="text-muted-foreground mt-1">Read and respond to student feedback</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.averageRating}</p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            <p className="text-xs text-muted-foreground">Responded</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Response</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by course or student..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review: CourseReview) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {/* FIXED: Use to and params instead of template string */}
                    <Link 
                      to="/learner/courses/courses/$courseId"
                      params={{ courseId: review.courseId }}
                      className="font-semibold text-navy hover:text-gold"
                    >
                      {review.courseTitle}
                    </Link>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star: number) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                  <p className="mt-3 text-foreground">{review.comment}</p>
                  <p className="mt-2 text-sm text-muted-foreground">— {review.user}</p>
                </div>
                {/* FIXED: Use to and params for manage link as well */}
                <Link 
                  to="/mentor/courses/manage/$courseId"
                  params={{ courseId: review.courseId }}
                >
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {review.replies.length > 0 ? "View Reply" : "Respond"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-border bg-card">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}