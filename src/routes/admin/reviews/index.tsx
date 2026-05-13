import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, Star, Trash2, Flag, Eye, CheckCircle, XCircle, Calendar, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { mockReviews } from "@/data/mockReviews";
import { courses } from "@/data/mockCourses";
import { toast } from "sonner";

interface ReviewWithCourse extends Review {
  courseTitle: string;
  courseId: string;
}

import type { Review } from "@/data/mockReviews";

export const Route = createFileRoute("/admin/reviews/")({
  head: () => ({
    meta: [
      { title: "Manage Reviews — Sandiwa Admin" },
      { name: "description", content: "Moderate and manage all course reviews." },
    ],
  }),
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "flagged" | "pending">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  // Get all reviews with course info
  const reviewsWithCourse: ReviewWithCourse[] = mockReviews.map(review => {
    const course = courses.find(c => c.id === review.courseId);
    return {
      ...review,
      courseTitle: course?.title || "Unknown Course",
      courseId: review.courseId,
    };
  });

  // Apply filters
  const filteredReviews = reviewsWithCourse.filter(review => {
    // Search filter
    const matchesSearch = 
      review.comment.toLowerCase().includes(search.toLowerCase()) ||
      review.user.toLowerCase().includes(search.toLowerCase()) ||
      review.courseTitle.toLowerCase().includes(search.toLowerCase());
    
    // Rating filter
    const matchesRating = ratingFilter === "all" || Math.floor(review.rating) === ratingFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === "flagged") {
      matchesStatus = review.likes < 0;
    } else if (statusFilter === "pending") {
      matchesStatus = !review.isVerifiedPurchase;
    }
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const stats = {
    total: reviewsWithCourse.length,
    averageRating: (reviewsWithCourse.reduce((sum, r) => sum + r.rating, 0) / reviewsWithCourse.length).toFixed(1),
    flagged: reviewsWithCourse.filter(r => r.likes < 0).length,
    pending: reviewsWithCourse.filter(r => !r.isVerifiedPurchase).length,
    fiveStar: reviewsWithCourse.filter(r => Math.floor(r.rating) === 5).length,
  };

  const handleDelete = (reviewId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}'s review? This action cannot be undone.`)) {
      // In a real app, you would call an API here
      toast.success(`Review from ${userName} deleted successfully`);
    }
  };

  const handleFlag = (reviewId: string, userName: string) => {
    toast.info(`Review from ${userName} has been flagged for moderation`);
  };

  const handleApprove = (reviewId: string, userName: string) => {
    toast.success(`Review from ${userName} has been approved`);
  };

  const handleReject = (reviewId: string, userName: string) => {
    if (confirm(`Reject ${userName}'s review?`)) {
      toast.info(`Review from ${userName} has been rejected`);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (review: ReviewWithCourse) => {
    if (review.likes < 0) {
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1"><Flag className="h-3 w-3" /> Flagged</span>;
    }
    if (!review.isVerifiedPurchase) {
      return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
    return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</span>;
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Manage Reviews</h1>
          <p className="text-muted-foreground mt-1">Moderate and manage all student reviews across the platform</p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-gold">{stats.averageRating}</p>
            <p className="text-xs text-muted-foreground">Avg. Rating</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-gold">{stats.fiveStar}</p>
            <p className="text-xs text-muted-foreground">5-Star Reviews</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, course, or comment..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Approval</option>
            <option value="flagged">Flagged</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Course & Meta Info */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <Link 
                        to="/learner/courses/courses/$courseId"
                        params={{ courseId: review.courseId }}
                        className="font-semibold text-navy hover:text-gold text-sm"
                      >
                        {review.courseTitle}
                      </Link>
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      {getStatusBadge(review)}
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-medium text-navy mt-2">{review.title}</h4>
                    )}

                    {/* Review Comment */}
                    <p className="mt-2 text-sm text-foreground">{review.comment}</p>

                    {/* User Info */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-semibold">
                        {review.userInitials}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.user}</span>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Helpful Count */}
                    <p className="text-xs text-muted-foreground mt-2">
                      {review.helpful} people found this helpful
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Link to="/mentor/courses/manage/$courseId" params={{ courseId: review.courseId }}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" /> View Course
                      </Button>
                    </Link>
                    {!review.isVerifiedPurchase && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleApprove(review.id, review.user)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(review.id, review.user)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>

                {/* Replies Section */}
                {review.replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Mentor Response:</p>
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-semibold">
                            {reply.userInitials}
                          </div>
                          <span className="text-xs font-medium">{reply.user}</span>
                          {reply.isMentor && (
                            <span className="text-xs text-gold">(Mentor)</span>
                          )}
                          <span className="text-xs text-muted-foreground">{reply.date}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{reply.reply}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-16 rounded-xl border border-border bg-card">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reviews found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setRatingFilter("all");
                }}
                className="mt-4 text-red-500 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}