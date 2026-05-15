// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Star, ThumbsUp, Send, Trash2, Filter } from "lucide-react";
// import { toast } from "sonner";
// import { getReviewsByCourseId, type Review, type ReviewReply } from "@/data/mockReviews";

// interface CourseReviewsProps {
//   courseId: string;
//   courseTitle: string;
//   mentorName: string;
//   averageRating?: number;
//   totalReviews?: number;
// }

// export function CourseReviews({ 
//   courseId, 
//   courseTitle, 
//   mentorName,
//   averageRating = 0,
//   totalReviews = 0
// }: CourseReviewsProps) {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [newRating, setNewRating] = useState(0);
//   const [newTitle, setNewTitle] = useState("");
//   const [newComment, setNewComment] = useState("");
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
//   const [ratingFilter, setRatingFilter] = useState<string>("all");

//   const currentUser = {
//     name: localStorage.getItem("userName") || "Student",
//     initials: localStorage.getItem("userInitials") || "ST",
//   };

//   const userRole = localStorage.getItem("userRole") || "learner";
//   const isMentor = userRole === "mentor";
//   const isEnrolled = true;

//   useEffect(() => {
//     const courseReviews = getReviewsByCourseId(courseId);
//     setReviews(courseReviews);
//   }, [courseId]);

//   // Filter reviews based on selected rating
//   const getFilteredReviews = () => {
//     if (ratingFilter === "all") return reviews;
//     const filterValue = parseInt(ratingFilter);
//     if (filterValue === 5) {
//       return reviews.filter(review => Math.floor(review.rating) === 5);
//     } else {
//       return reviews.filter(review => Math.floor(review.rating) >= filterValue);
//     }
//   };

//   const filteredReviews = getFilteredReviews();

//   // Calculate stats
//   const stats = {
//     average: reviews.length > 0 
//       ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//       : averageRating.toFixed(1),
//     total: reviews.length + totalReviews,
//     distribution: [5, 4, 3, 2, 1].map(star => {
//       const count = reviews.filter(r => Math.floor(r.rating) === star).length;
//       return {
//         star,
//         count,
//         percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
//       };
//     })
//   };

//   const handleSubmitReview = () => {
//     if (newRating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     if (!newComment.trim()) {
//       toast.error("Please write a review");
//       return;
//     }

//     setIsSubmitting(true);

//     setTimeout(() => {
//       const newReview: Review = {
//         id: Date.now().toString(),
//         courseId: courseId,
//         user: currentUser.name,
//         userInitials: currentUser.initials,
//         rating: newRating,
//         title: newTitle || `${newRating}-Star Review`,
//         comment: newComment,
//         date: new Date().toISOString().split('T')[0],
//         likes: 0,
//         helpful: 0,
//         isVerifiedPurchase: isEnrolled,
//         replies: [],
//       };

//       setReviews([newReview, ...reviews]);
//       setNewRating(0);
//       setNewTitle("");
//       setNewComment("");
//       setShowReviewForm(false);
//       setIsSubmitting(false);
//       toast.success("Review submitted! Thank you for your feedback.");
//     }, 500);
//   };

//   const handleHelpful = (reviewId: string) => {
//     setReviews(reviews.map(r =>
//       r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
//     ));
//     toast.success("Thanks for your feedback!");
//   };

//   const handleReply = (reviewId: string) => {
//     const reply = replyInputs[reviewId];
//     if (!reply?.trim()) {
//       toast.error("Please enter a reply");
//       return;
//     }

//     const newReply: ReviewReply = {
//       id: Date.now().toString(),
//       reviewId: reviewId,
//       user: isMentor ? mentorName : currentUser.name,
//       userInitials: isMentor ? "M" : currentUser.initials,
//       reply: reply,
//       date: new Date().toISOString().split('T')[0],
//       isMentor: isMentor,
//       likes: 0,
//     };

//     setReviews(reviews.map(r =>
//       r.id === reviewId
//         ? { ...r, replies: [...r.replies, newReply] }
//         : r
//     ));

//     setReplyInputs({ ...replyInputs, [reviewId]: "" });
//     toast.success("Reply posted!");
//   };

//   const handleDeleteReview = (reviewId: string) => {
//     if (confirm("Are you sure you want to delete this review?")) {
//       setReviews(reviews.filter(r => r.id !== reviewId));
//       toast.success("Review deleted");
//     }
//   };

//   const renderStars = (rating: number, interactive = false, onRating?: (r: number) => void) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => interactive && onRating?.(star)}
//             onMouseEnter={() => interactive && setHoveredRating(star)}
//             onMouseLeave={() => interactive && setHoveredRating(0)}
//             className={interactive ? "cursor-pointer" : "cursor-default"}
//             disabled={!interactive}
//           >
//             <Star
//               className={`h-5 w-5 ${
//                 star <= (interactive ? hoveredRating || rating : rating)
//                   ? "fill-gold text-gold"
//                   : "fill-none text-muted-foreground"
//               } transition-colors`}
//             />
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Get filter label for display
//   const getFilterLabel = () => {
//     switch (ratingFilter) {
//       case "all": return "All ratings";
//       case "5": return "5 stars only";
//       case "4": return "4 stars & up";
//       case "3": return "3 stars & up";
//       case "2": return "2 stars & up";
//       case "1": return "1 star & up";
//       default: return "All ratings";
//     }
//   };

//   return (
//     <div className="rounded-xl border border-border bg-card overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-5 border-b border-border bg-muted/30">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <h3 className="font-serif text-xl font-bold text-navy">Student Reviews</h3>
//             <p className="text-sm text-muted-foreground">
//               What students are saying about this course
//             </p>
//           </div>
//           {isEnrolled && !showReviewForm && (
//             <Button
//               onClick={() => setShowReviewForm(true)}
//               className="bg-gold hover:bg-gold/90 text-gold-foreground"
//             >
//               Write a Review
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Rating Summary */}
//       <div className="px-6 py-6 border-b border-border bg-cream/50">
//         <div className="flex flex-col md:flex-row gap-8 items-center">
//           <div className="text-center">
//             <div className="text-5xl font-serif font-bold text-navy">{stats.average}</div>
//             <div className="mt-2">{renderStars(parseFloat(stats.average))}</div>
//             <div className="mt-1 text-sm text-muted-foreground">
//               Based on {stats.total} {stats.total === 1 ? "review" : "reviews"}
//             </div>
//           </div>
//           <div className="flex-1 max-w-md">
//             {stats.distribution.map((item) => (
//               <div key={item.star} className="flex items-center gap-3 mb-2">
//                 <div className="w-12 text-sm text-muted-foreground">{item.star} ★</div>
//                 <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
//                   <div
//                     className="h-full rounded-full bg-gold transition-all"
//                     style={{ width: `${item.percentage}%` }}
//                   />
//                 </div>
//                 <div className="w-12 text-sm text-muted-foreground">{item.count}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Write Review Form */}
//       {showReviewForm && (
//         <div className="p-6 border-b border-border bg-muted/20">
//           <h4 className="font-semibold text-navy mb-4">Write a Review</h4>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium block mb-2">Your Rating *</label>
//               {renderStars(newRating, true, setNewRating)}
//             </div>
//             <div>
//               <label className="text-sm font-medium block mb-2">Review Title (Optional)</label>
//               <input
//                 type="text"
//                 value={newTitle}
//                 onChange={(e) => setNewTitle(e.target.value)}
//                 placeholder="Summarize your experience"
//                 className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium block mb-2">Your Review *</label>
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="What did you like? What could be improved?"
//                 rows={4}
//                 className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
//               />
//             </div>
//             <div className="flex gap-3 justify-end">
//               <Button variant="outline" onClick={() => setShowReviewForm(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmitReview}
//                 className="bg-gold hover:bg-gold/90 text-gold-foreground"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Review"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filter Dropdown */}
//       <div className="px-6 py-4 border-b border-border bg-background">
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <span className="text-sm font-medium text-muted-foreground">
//             Showing {filteredReviews.length} of {reviews.length} reviews
//           </span>
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <select
//               value={ratingFilter}
//               onChange={(e) => setRatingFilter(e.target.value)}
//               className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
//             >
//               <option value="all">All ratings</option>
//               <option value="5">5 stars only</option>
//               <option value="4">4 stars & up</option>
//               <option value="3">3 stars & up</option>
//               <option value="2">2 stars & up</option>
//               <option value="1">1 star & up</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Reviews List */}
//       <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
//         {filteredReviews.length === 0 ? (
//           <div className="px-6 py-12 text-center">
//             <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">
//               {ratingFilter !== "all" 
//                 ? `No ${getFilterLabel().toLowerCase()} reviews yet.` 
//                 : "No reviews yet. Be the first to review this course!"}
//             </p>
//           </div>
//         ) : (
//           filteredReviews.map((review) => (
//             <div key={review.id} className="p-6">
//               <div className="flex gap-4">
//                 <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center text-base font-semibold flex-shrink-0">
//                   {review.userInitials.slice(0, 2)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between flex-wrap gap-2">
//                     <div>
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="font-semibold text-navy">{review.user}</span>
//                         {review.isVerifiedPurchase && (
//                           <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
//                             Verified Purchase
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2 mt-1">
//                         {renderStars(review.rating)}
//                         <span className="text-xs text-muted-foreground">
//                           {new Date(review.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                     {currentUser.name === review.user && (
//                       <button
//                         onClick={() => handleDeleteReview(review.id)}
//                         className="text-muted-foreground hover:text-destructive transition-colors"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
//                   {review.title && (
//                     <h4 className="mt-3 font-semibold text-navy">{review.title}</h4>
//                   )}
//                   <p className="mt-2 text-foreground">{review.comment}</p>
//                   <div className="flex items-center gap-4 mt-3">
//                     <button
//                       onClick={() => handleHelpful(review.id)}
//                       className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
//                     >
//                       <ThumbsUp className="h-3.5 w-3.5" />
//                       Helpful ({review.helpful})
//                     </button>
//                   </div>
//                   {review.replies.length > 0 && (
//                     <div className="mt-4 space-y-3">
//                       {review.replies.map((reply) => (
//                         <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-gold/30">
//                           <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
//                             reply.isMentor
//                               ? "bg-gold/20 text-gold"
//                               : "bg-muted text-muted-foreground"
//                           }`}>
//                             {reply.userInitials.slice(0, 2)}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className="text-sm font-medium text-navy">{reply.user}</span>
//                               {reply.isMentor && (
//                                 <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold/10 text-gold">
//                                   Instructor
//                                 </span>
//                               )}
//                               <span className="text-xs text-muted-foreground">
//                                 {new Date(reply.date).toLocaleDateString()}
//                               </span>
//                             </div>
//                             <p className="mt-1 text-sm text-foreground">{reply.reply}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {isMentor && (
//                     <div className="mt-4">
//                       <textarea
//                         placeholder="Reply to this review..."
//                         value={replyInputs[review.id] || ""}
//                         onChange={(e) => setReplyInputs({ ...replyInputs, [review.id]: e.target.value })}
//                         rows={2}
//                         className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
//                       />
//                       <div className="flex justify-end mt-2">
//                         <Button
//                           size="sm"
//                           onClick={() => handleReply(review.id)}
//                           className="bg-gold hover:bg-gold/90 text-gold-foreground"
//                         >
//                           <Send className="h-3 w-3 mr-1" /> Reply to Review
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }




























import { Star, User, ThumbsUp, Flag, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpfulCount: number;
  reported?: boolean;
  courseId: string;
  isVerifiedPurchase: boolean;
}

// Define the type for enrolled course data
interface EnrolledCourse {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  enrolledAt: string;
  progress: number;
}

interface CourseReviewsProps {
  courseId: string;
  courseTitle: string;
  mentorName: string;
  averageRating: number;
  totalReviews: number;
}

// Helper to get stored reviews
const getStoredReviews = (courseId: string): Review[] => {
  const stored = localStorage.getItem(`sandiwa.reviews.${courseId}`);
  if (stored) {
    return JSON.parse(stored, (key, value) => {
      if (key === "date") return new Date(value);
      return value;
    });
  }
  return [];
};

// Helper to save reviews
const saveStoredReviews = (courseId: string, reviews: Review[]) => {
  localStorage.setItem(`sandiwa.reviews.${courseId}`, JSON.stringify(reviews));
};

// Check if user is enrolled in the course
const isUserEnrolled = (courseId: string): boolean => {
  const storedEnrolled = localStorage.getItem("sandiwa.enrolled");
  if (!storedEnrolled) return false;
  
  const enrolledCourses = JSON.parse(storedEnrolled) as EnrolledCourse[];
  return enrolledCourses.some((course: EnrolledCourse) => course.id === courseId);
};

// Get current user info
const getCurrentUser = (): { name: string; id: string } | null => {
  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  
  if (!userName || !userId) return null;
  return { name: userName, id: userId };
};

export function CourseReviews({ 
  courseId, 
  courseTitle, 
  mentorName, 
  averageRating, 
  totalReviews 
}: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load reviews and check enrollment on mount
  useEffect(() => {
    const loadedReviews = getStoredReviews(courseId);
    setReviews(loadedReviews);
    
    const enrolled = isUserEnrolled(courseId);
    setIsEnrolled(enrolled);
    
    // Check if current user has already reviewed
    const currentUser = getCurrentUser();
    if (currentUser && enrolled) {
      const userReviewed = loadedReviews.some(r => r.userName === currentUser.name);
      setHasReviewed(userReviewed);
    }
  }, [courseId]);
  
  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const updated = { ...review, helpfulCount: review.helpfulCount + 1 };
        saveStoredReviews(courseId, prev.map(r => r.id === reviewId ? updated : r));
        return updated;
      }
      return review;
    }));
    toast.success("Thanks for your feedback!");
  };
  
  const handleReport = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId && !review.reported) {
        const updated = { ...review, reported: true };
        saveStoredReviews(courseId, prev.map(r => r.id === reviewId ? updated : r));
        toast.success("Review has been reported. Our team will review it.");
        return updated;
      }
      return review;
    }));
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewTitle.trim()) {
      toast.error("Please enter a review title");
      return;
    }
    
    if (!reviewContent.trim()) {
      toast.error("Please enter your review content");
      return;
    }
    
    setIsSubmitting(true);
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("Please log in to leave a review");
      setIsSubmitting(false);
      return;
    }
    
    const newReview: Review = {
      id: `review_${Date.now()}`,
      userName: currentUser.name,
      rating,
      title: reviewTitle.trim(),
      content: reviewContent.trim(),
      date: new Date(),
      helpfulCount: 0,
      courseId,
      isVerifiedPurchase: true, // Since we checked enrollment
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    saveStoredReviews(courseId, updatedReviews);
    setHasReviewed(true);
    
    // Reset form
    setRating(5);
    setReviewTitle("");
    setReviewContent("");
    setShowReviewForm(false);
    
    toast.success("Thank you for your review!");
    setIsSubmitting(false);
  };
  
  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  };
  
  const ratingBreakdown = getRatingBreakdown();
  
  return (
    <div className="border-t border-border pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-navy">
            Learner Reviews
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-gold text-gold" />
              <span className="text-xl font-bold text-navy">{averageRating}</span>
              <span className="text-muted-foreground">
                out of 5
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({totalReviews} ratings)
            </span>
          </div>
        </div>
        
        {/* Only show Add Review button if user is enrolled AND hasn't reviewed yet */}
        {isEnrolled && !hasReviewed && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-gold hover:bg-gold/90 text-gold-foreground"
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
        
        {/* Show message if user already reviewed */}
        {isEnrolled && hasReviewed && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <Star className="h-4 w-4 fill-green-600 text-green-600" />
            <span>Thank you for reviewing this course!</span>
          </div>
        )}
        
        {/* Show message if user is not enrolled */}
        {!isEnrolled && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Purchase this course to leave a review</span>
          </div>
        )}
      </div>
      
      {/* Review Form */}
      {showReviewForm && isEnrolled && !hasReviewed && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-navy">Share Your Experience</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How would you rate {courseTitle}?
          </p>
          
          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Your Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-7 w-7 transition ${
                        star <= (hoverRating || rating) 
                          ? "fill-gold text-gold" 
                          : "text-muted-foreground"
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : rating === 1 ? "Terrible" : "Select rating"}
                </span>
              </div>
            </div>
            
            {/* Review Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Review Title *
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g., Great course, highly recommend!"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                maxLength={100}
              />
            </div>
            
            {/* Review Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Your Review *
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                placeholder="What did you like about this course? What could be improved?"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {reviewContent.length}/1000 characters
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold/90 text-gold-foreground"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(5);
                  setReviewTitle("");
                  setReviewContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-medium text-navy">Rating Breakdown</h4>
            <div className="mt-3 space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-12 flex items-center gap-1">
                      {star} <Star className="h-3 w-3 fill-gold text-gold" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-muted-foreground text-xs">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-medium text-navy">About Reviews</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              All reviews are from verified learners who have purchased and completed this course.
              Each review goes through our quality moderation process.
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" /> Helpful votes
              </span>
              <span className="flex items-center gap-1">
                <Flag className="h-3 w-3" /> Report inappropriate
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> Verified purchase
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="mt-8 space-y-5">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <Star className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No reviews yet.</p>
            {isEnrolled && !hasReviewed && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 bg-gold hover:bg-gold/90 text-gold-foreground"
              >
                Be the first to leave a review!
              </Button>
            )}
            {!isEnrolled && (
              <p className="mt-2 text-sm text-muted-foreground">
                Purchase this course to share your experience.
              </p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="font-medium text-gold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-navy">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {review.date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <h4 className="mt-3 font-semibold text-navy">{review.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{review.content}</p>
              
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition py-1"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful ({review.helpfulCount})
                </button>
                {!review.reported && (
                  <button
                    onClick={() => handleReport(review.id)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition py-1"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Report
                  </button>
                )}
                {review.reported && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flag className="h-3.5 w-3.5" />
                    Reported
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}