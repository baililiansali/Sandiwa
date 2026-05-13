// src/data/mockReviews.ts

export interface ReviewReply {
  id: string;
  reviewId: string;
  user: string;
  userInitials: string;
  reply: string;
  date: string;
  isMentor: boolean;
  likes?: number;
}

export interface Review {
  id: string;
  courseId: string;
  user: string;
  userInitials: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  helpful: number;
  isVerifiedPurchase: boolean;
  replies: ReviewReply[];
}

// Mock data for courses
const COURSE_REVIEWS: Record<string, Review[]> = {
  // Complete Filipino Language for Beginners
  "filipino-beginners": [
    {
      id: "rev_001",
      courseId: "filipino-beginners",
      user: "Maria Santos",
      userInitials: "MS",
      rating: 5,
      title: "Excellent course for beginners!",
      comment: "This course was exactly what I needed to start learning Filipino. The lessons are well-structured and the instructor explains concepts clearly. I've already recommended it to my friends!",
      date: "2026-03-15",
      likes: 45,
      helpful: 48,
      isVerifiedPurchase: true,
      replies: [
        {
          id: "reply_001",
          reviewId: "rev_001",
          user: "Maria Santos (Instructor)",
          userInitials: "MS",
          reply: "Thank you so much for your wonderful review! I'm thrilled to hear that the course helped you. Keep up the great work! 🇵🇭",
          date: "2026-03-16",
          isMentor: true,
          likes: 12
        }
      ]
    },
    {
      id: "rev_002",
      courseId: "filipino-beginners",
      user: "John Reyes",
      userInitials: "JR",
      rating: 4,
      title: "Great content, more practice needed",
      comment: "The content is excellent and the instructor is very knowledgeable. I would love to see more practice exercises and quizzes to reinforce learning. Overall, a solid course!",
      date: "2026-03-10",
      likes: 23,
      helpful: 25,
      isVerifiedPurchase: true,
      replies: []
    },
    {
      id: "rev_003",
      courseId: "filipino-beginners",
      user: "Anna Garcia",
      userInitials: "AG",
      rating: 5,
      title: "Best Filipino course on the platform",
      comment: "I've tried several language learning apps, but this course is by far the best. The cultural insights are invaluable and the pronunciation guides are spot-on. Salamat po!",
      date: "2026-03-05",
      likes: 67,
      helpful: 70,
      isVerifiedPurchase: true,
      replies: [
        {
          id: "reply_002",
          reviewId: "rev_003",
          user: "Maria Santos (Instructor)",
          userInitials: "MS",
          reply: "Maraming salamat for your kind words! I'm so happy that the cultural insights were helpful for you. Keep learning! 🎓",
          date: "2026-03-06",
          isMentor: true,
          likes: 8
        }
      ]
    }
  ],

  // Philippine History and Heritage Masterclass
  "philippine-history": [
    {
      id: "rev_004",
      courseId: "philippine-history",
      user: "Jose Rizal",
      userInitials: "JR",
      rating: 5,
      title: "Comprehensive and engaging",
      comment: "As someone passionate about Philippine history, I was impressed by the depth and accuracy of this course. The lectures are engaging and well-researched.",
      date: "2026-03-12",
      likes: 89,
      helpful: 92,
      isVerifiedPurchase: true,
      replies: [
        {
          id: "reply_003",
          reviewId: "rev_004",
          user: "Jose Reyes (Instructor)",
          userInitials: "JR",
          reply: "Thank you for the wonderful review! I'm passionate about sharing our rich history. Glad you enjoyed the course!",
          date: "2026-03-13",
          isMentor: true,
          likes: 15
        }
      ]
    },
    {
      id: "rev_005",
      courseId: "philippine-history",
      user: "Andres Bonifacio",
      userInitials: "AB",
      rating: 5,
      title: "Inspiring and educational",
      comment: "This course gave me a deeper appreciation for our heroes and their sacrifices. The multimedia content really brings history to life. Highly recommended for all Filipinos!",
      date: "2026-03-08",
      likes: 76,
      helpful: 80,
      isVerifiedPurchase: true,
      replies: []
    },
    {
      id: "rev_006",
      courseId: "philippine-history",
      user: "Anonymous User",
      userInitials: "AN",
      rating: 2,
      title: "SPAM",
      comment: "Buy cheap watches online at bestwatches.com! Discount code: WATCH2026",
      date: "2026-02-25",
      likes: 0,
      helpful: 0,
      isVerifiedPurchase: false,
      replies: []
    }
  ],

  // Authentic Filipino Cuisine
  "filipino-cuisine-basics": [
    {
      id: "rev_007",
      courseId: "filipino-cuisine-basics",
      user: "Luis Fernandez",
      userInitials: "LF",
      rating: 5,
      title: "My adobo turned out perfect!",
      comment: "The step-by-step instructions are so easy to follow. My family loved the adobo I made using the techniques from this course. Can't wait to try the sinigang lesson!",
      date: "2026-03-14",
      likes: 56,
      helpful: 60,
      isVerifiedPurchase: true,
      replies: [
        {
          id: "reply_004",
          reviewId: "rev_007",
          user: "Ana Cruz (Instructor)",
          userInitials: "AC",
          reply: "I'm so happy to hear that! Your family enjoying your cooking is the best compliment. Keep cooking! 👩‍🍳",
          date: "2026-03-15",
          isMentor: true,
          likes: 10
        }
      ]
    },
    {
      id: "rev_008",
      courseId: "filipino-cuisine-basics",
      user: "Sofia Garcia",
      userInitials: "SG",
      rating: 5,
      title: "Authentic recipes from a true expert",
      comment: "Finally, a Filipino cooking course that teaches authentic recipes passed down through generations. The lumpia recipe is exactly like my lola used to make!",
      date: "2026-03-10",
      likes: 43,
      helpful: 45,
      isVerifiedPurchase: true,
      replies: []
    }
  ],

  // Filipino Arts and Crafts
  "filipino-arts-crafts": [
    {
      id: "rev_009",
      courseId: "filipino-arts-crafts",
      user: "Patricia Cruz",
      userInitials: "PC",
      rating: 4,
      title: "Beautiful traditional crafts",
      comment: "The weaving techniques are beautifully explained. I wish there were more video demonstrations for the more complex patterns, but overall a great introduction.",
      date: "2026-03-07",
      likes: 28,
      helpful: 30,
      isVerifiedPurchase: true,
      replies: [
        {
          id: "reply_005",
          reviewId: "rev_009",
          user: "Ana Cruz (Instructor)",
          userInitials: "AC",
          reply: "Thank you for the feedback! I'll be adding more detailed video tutorials for the complex patterns in the next update. Keep practicing! 🎨",
          date: "2026-03-08",
          isMentor: true,
          likes: 6
        }
      ]
    }
  ],

  // Traditional Filipino Music
  "filipino-music": [
    {
      id: "rev_010",
      courseId: "filipino-music",
      user: "Ramon Santos",
      userInitials: "RS",
      rating: 5,
      title: "Excellent music history course",
      comment: "I learned so much about the kulintang and other traditional instruments. The audio examples are fantastic and really bring the lessons to life. Highly recommended for music enthusiasts!",
      date: "2026-03-03",
      likes: 52,
      helpful: 55,
      isVerifiedPurchase: true,
      replies: []
    }
  ]
};

// Helper function to get reviews by course ID
export function getReviewsByCourseId(courseId: string): Review[] {
  return COURSE_REVIEWS[courseId] || [];
}

// Helper function to add a new review (for mocking new submissions)
export function addReview(courseId: string, review: Review): Review[] {
  const existingReviews = COURSE_REVIEWS[courseId] || [];
  COURSE_REVIEWS[courseId] = [review, ...existingReviews];
  return COURSE_REVIEWS[courseId];
}

// Helper function to get all reviews for a mentor (for mentor analytics)
export function getReviewsByMentor(mentorId: string): Review[] {
  // This would filter reviews by mentor in a real implementation
  // For mock purposes, return all reviews
  return Object.values(COURSE_REVIEWS).flat();
}

// Helper function to get average rating for a course
export function getAverageRating(courseId: string): number {
  const reviews = getReviewsByCourseId(courseId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// Helper function to get rating distribution for a course
export function getRatingDistribution(courseId: string): Record<number, number> {
  const reviews = getReviewsByCourseId(courseId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    distribution[Math.floor(review.rating)]++;
  });
  return distribution;
}