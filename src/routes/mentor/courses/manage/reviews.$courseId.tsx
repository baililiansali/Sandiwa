import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Star, StarHalf, User, ThumbsUp, MessageCircle,
  Calendar, Flag, CheckCircle, XCircle, Award, Filter, Search,
  Download, Trash2, Edit, Reply, Heart, Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor/courses/manage/reviews/$courseId")({
  component: CourseReviewsPage,
});

interface Review {
  id: string;
  studentName: string;
  studentAvatar?: string;
  studentEmail: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  replied: boolean;
  replyContent?: string;
  replyDate?: string;
  images?: string[];
}

function CourseReviewsPage() {
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "helpful">("recent");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Mock course data
  const course = {
    id: courseId,
    title: "Philippine History and Heritage Masterclass",
    rating: 4.8,
    totalReviews: 1245,
  };

  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      studentName: "Maria Santos",
      studentEmail: "maria@example.com",
      rating: 5,
      title: "Absolutely amazing course!",
      content: "This course exceeded my expectations! The instructor was very knowledgeable and the lessons were well-structured. I learned so much about Philippine history that I never knew before. Highly recommend to anyone interested in Filipino culture.",
      date: "2024-01-15T10:30:00Z",
      helpful: 45,
      verified: true,
      replied: true,
      replyContent: "Thank you Maria! So glad you enjoyed the course. Keep learning!",
      replyDate: "2024-01-16T09:00:00Z",
      images: []
    },
    {
      id: "2",
      studentName: "John Reyes",
      studentEmail: "john@example.com",
      rating: 4,
      title: "Great content, but pacing could be better",
      content: "The content is excellent and very informative. However, some lessons felt a bit rushed. Would love to see more in-depth explanations on certain topics. Overall, still a great course!",
      date: "2024-01-10T14:20:00Z",
      helpful: 23,
      verified: true,
      replied: false,
      images: []
    },
    {
      id: "3",
      studentName: "Ana Cruz",
      studentEmail: "ana@example.com",
      rating: 5,
      title: "Life-changing experience!",
      content: "This course opened my eyes to our rich heritage. The video lessons were engaging and the quizzes helped reinforce learning. I've already recommended this to my friends!",
      date: "2024-01-05T09:15:00Z",
      helpful: 67,
      verified: true,
      replied: true,
      replyContent: "Thank you Ana! We're so happy to hear that!",
      replyDate: "2024-01-06T11:30:00Z",
      images: []
    },
    {
      id: "4",
      studentName: "Mike Lopez",
      studentEmail: "mike@example.com",
      rating: 3,
      title: "Good but needs improvement",
      content: "The course material is good, but I found some technical issues with the video player. Also, the assignments could be more challenging.",
      date: "2024-01-03T16:45:00Z",
      helpful: 12,
      verified: true,
      replied: false,
      images: []
    },
    {
      id: "5",
      studentName: "Lisa Garcia",
      studentEmail: "lisa@example.com",
      rating: 5,
      title: "Best investment I made this year!",
      content: "Worth every peso! The instructor's passion for the subject is contagious. The downloadable resources are very helpful. 10/10 would recommend!",
      date: "2023-12-28T11:00:00Z",
      helpful: 89,
      verified: true,
      replied: false,
      images: []
    }
  ]);

  // Calculate statistics
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  const totalHelpful = reviews.reduce((sum, r) => sum + r.helpful, 0);
  const responseRate = ((reviews.filter(r => r.replied).length / reviews.length) * 100).toFixed(0);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      if (filterRating !== "all" && review.rating !== filterRating) return false;
      if (searchTerm) {
        return review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
               review.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else {
        return b.helpful - a.helpful;
      }
    });

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted successfully");
    }
  };

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.replyContent || "");
    setShowReplyModal(true);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    if (selectedReview) {
      setReviews(reviews.map(r => 
        r.id === selectedReview.id 
          ? { 
              ...r, 
              replied: true, 
              replyContent: replyText, 
              replyDate: new Date().toISOString() 
            }
          : r
      ));
      toast.success("Reply posted successfully!");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedReview(null);
    }
  };

  const handleFlagReview = (reviewId: string) => {
    toast.info("Review has been reported for review");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: `/mentor/courses/manage/${courseId}` });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-gold text-gold" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-gold text-gold" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back 
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Course Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to student feedback for "{course.title}"
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="flex">{renderStars(Number(averageRating))}</div>
            </div>
            <p className="text-2xl font-bold text-navy">{averageRating}</p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <MessageCircle className="h-8 w-8 text-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-navy">{course.totalReviews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <ThumbsUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-navy">{totalHelpful.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-navy">{responseRate}%</p>
            <p className="text-xs text-muted-foreground">Response Rate</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-navy">4.9</p>
            <p className="text-xs text-muted-foreground">Course Rating</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <h3 className="font-semibold text-navy mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span>{rating}</span>
                    <Star className="h-3 w-3 fill-gold text-gold" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "rating" | "helpful")}
              className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <Button variant="outline" onClick={() => toast.info("Review is being exported!")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-border bg-card">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-navy">No reviews found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? "Try adjusting your search terms" : "No reviews available for this course yet"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-navy">{review.studentName}</h4>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified Student
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleFlagReview(review.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h5 className="font-medium text-navy mb-2">{review.title}</h5>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>

                {/* Helpful Count */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => toast.success("Thanks for your feedback!")}
                    className="text-gold hover:text-gold/80"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleReply(review)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    {review.replied ? "Edit Reply" : "Reply"}
                  </Button>
                </div>

                {/* Reply Section */}
                {review.replied && review.replyContent && (
                  <div className="mt-4 pl-4 border-l-4 border-gold/30 bg-muted/20 rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium text-navy">Instructor Response</span>
                      <span className="text-xs text-muted-foreground">
                        {review.replyDate && formatDate(review.replyDate)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.replyContent}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-navy">
                    {selectedReview.replied ? "Edit Reply" : "Reply to Review"}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowReplyModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4 p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gold" />
                    <span className="font-medium text-navy">{selectedReview.studentName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedReview.content}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    Your Response *
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Thank the student and address their feedback..."
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReplyModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReply}
                    className="flex-1 bg-gold hover:bg-gold/90 text-white"
                  >
                    {selectedReview.replied ? "Update Reply" : "Post Reply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}

// X icon component (if not imported)
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);