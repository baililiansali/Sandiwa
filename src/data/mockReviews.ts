// src/data/mockReviews.ts

export type Review = {
  id: string;
  courseId: string;
  user: string;
  userInitials: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  helpful: number;
  isVerifiedPurchase: boolean;
  isEdited?: boolean;
  editedAt?: string;
  replies: ReviewReply[];
}

export type ReviewReply = {
  id: string;
  reviewId: string;
  user: string;
  userInitials: string;
  reply: string;
  date: string;
  isMentor: boolean;
  likes: number;
}

// Mock reviews for each course
export const mockReviews: Review[] = [
  // Reviews for Filipino Beginners Course
  {
    id: "rev1",
    courseId: "filipino-beginners",
    user: "Malia San Pedro",
    userInitials: "MS",
    rating: 5,
    title: "Excellent course for beginners!",
    comment: "I've tried learning Tagalog before but always gave up. This course breaks everything down so simply. The pronunciation tips are especially helpful. After just 2 weeks, I can already have basic conversations with my Filipino friends!",
    date: "2026-03-15",
    likes: 342,
    helpful: 89,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply1",
        reviewId: "rev1",
        user: "Maria Santos",
        userInitials: "MS",
        reply: "Thank you for your wonderful review! So glad to hear you're making progress. Keep practicing! ❤️",
        date: "2026-03-16",
        isMentor: true,
        likes: 45,
      }
    ]
  },
  {
    id: "rev2",
    courseId: "filipino-beginners",
    user: "John Reyes",
    userInitials: "JR",
    rating: 4,
    title: "Great content, wish there were more exercises",
    comment: "The lessons are very well structured and easy to follow. My only complaint is that I wish there were more practice exercises between lessons to reinforce learning.",
    date: "2026-03-10",
    likes: 128,
    helpful: 34,
    isVerifiedPurchase: true,
    replies: []
  },
  {
    id: "rev3",
    courseId: "filipino-beginners",
    user: "Anna Chen",
    userInitials: "AC",
    rating: 5,
    title: "Best Filipino course I've taken!",
    comment: "Maria is an amazing teacher. Her explanations are clear and she makes learning fun. The cultural notes are a great bonus! Highly recommend.",
    date: "2026-03-05",
    likes: 267,
    helpful: 56,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply2",
        reviewId: "rev3",
        user: "Maria Santos",
        userInitials: "MS",
        reply: "Thank you Anna! So happy you enjoyed the cultural sections. 🇵🇭",
        date: "2026-03-06",
        isMentor: true,
        likes: 23,
      }
    ]
  },
  {
    id: "rev4",
    courseId: "filipino-beginners",
    user: "David Kim",
    userInitials: "DK",
    rating: 4,
    title: "Good foundation for learning Tagalog",
    comment: "The course covers all the essentials. I can now understand basic Tagalog and introduce myself. The only reason I'm giving 4 stars is because the audio could be clearer in some lessons.",
    date: "2026-02-28",
    likes: 89,
    helpful: 23,
    isVerifiedPurchase: true,
    replies: []
  },
  {
    id: "rev5",
    courseId: "filipino-beginners",
    user: "Lisa Gomez",
    userInitials: "LG",
    rating: 5,
    title: "Life-changing!",
    comment: "I've been trying to learn my parents' native language for years. This course finally made it click. Salamat po, Maria!",
    date: "2026-02-20",
    likes: 412,
    helpful: 98,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply3",
        reviewId: "rev5",
        user: "Maria Santos",
        userInitials: "MS",
        reply: "Walang anuman! So happy to help you connect with your heritage. 🇵🇭",
        date: "2026-02-21",
        isMentor: true,
        likes: 67,
      }
    ]
  },

  // Reviews for Philippine History Course
  {
    id: "rev6",
    courseId: "philippine-history",
    user: "Carlos Mendez",
    userInitials: "CM",
    rating: 5,
    title: "Fascinating and well-researched",
    comment: "Professor Reyes brings history to life. The way he connects past events to modern Philippines is brilliant. I've recommended this to all my friends.",
    date: "2026-03-12",
    likes: 156,
    helpful: 42,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply4",
        reviewId: "rev6",
        user: "Jose Reyes",
        userInitials: "JR",
        reply: "Thank you Carlos! History becomes alive when we see its relevance today.",
        date: "2026-03-13",
        isMentor: true,
        likes: 31,
      }
    ]
  },
  {
    id: "rev7",
    courseId: "philippine-history",
    user: "Patricia Lee",
    userInitials: "PL",
    rating: 4,
    title: "Very informative but quite dense",
    comment: "Great content but a lot of information to absorb. I had to rewatch several lessons. Consider adding more visual aids or summaries.",
    date: "2026-03-08",
    likes: 67,
    helpful: 18,
    isVerifiedPurchase: true,
    replies: []
  },

  // Reviews for Traditional Arts Course
  {
    id: "rev8",
    courseId: "traditional-arts",
    user: "Megan Williams",
    userInitials: "MW",
    rating: 5,
    title: "Hands-on and so rewarding!",
    comment: "I never thought I could learn weaving online, but Ana makes it possible. The step-by-step videos are clear and I've already made my first project!",
    date: "2026-03-14",
    likes: 203,
    helpful: 51,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply5",
        reviewId: "rev8",
        user: "Ana Cruz",
        userInitials: "AC",
        reply: "So proud of your first project! Keep creating. 🎨",
        date: "2026-03-15",
        isMentor: true,
        likes: 42,
      }
    ]
  },
  {
    id: "rev9",
    courseId: "traditional-arts",
    user: "Robert Tan",
    userInitials: "RT",
    rating: 5,
    title: "Excellent cultural immersion",
    comment: "This course taught me so much about Filipino culture through art. The historical context provided for each craft is invaluable.",
    date: "2026-03-01",
    likes: 112,
    helpful: 28,
    isVerifiedPurchase: true,
    replies: []
  },

  // Reviews for Filipino Cuisine Course
  {
    id: "rev10",
    courseId: "filipino-cuisine-basics",
    user: "Isabella Cruz",
    userInitials: "IC",
    rating: 5,
    title: "My family loves my cooking now!",
    comment: "Before this course, I couldn't even make adobo. Now I'm cooking for parties! Lita's recipes are authentic and easy to follow.",
    date: "2026-03-13",
    likes: 289,
    helpful: 67,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply6",
        reviewId: "rev10",
        user: "Lita Mendoza",
        userInitials: "LM",
        reply: "This makes my heart so happy! Keep cooking with love! 🍳",
        date: "2026-03-14",
        isMentor: true,
        likes: 53,
      }
    ]
  },
  {
    id: "rev11",
    courseId: "filipino-cuisine-basics",
    user: "James Wilson",
    userInitials: "JW",
    rating: 4,
    title: "Great recipes, need ingredient alternatives",
    comment: "Some ingredients are hard to find outside the Philippines. Would love tips on substitutions.",
    date: "2026-03-07",
    likes: 78,
    helpful: 22,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply7",
        reviewId: "rev11",
        user: "Lita Mendoza",
        userInitials: "LM",
        reply: "Great suggestion! I'll add a lesson on ingredient substitutions soon. Thanks for the feedback!",
        date: "2026-03-08",
        isMentor: true,
        likes: 34,
      }
    ]
  },

  // Reviews for Kulintang Course
  {
    id: "rev12",
    courseId: "kulintang-basics",
    user: "Miguel Santos",
    userInitials: "MS",
    rating: 5,
    title: "Finally learning my heritage instrument!",
    comment: "I've always wanted to play kulintang but couldn't find a teacher. Ramon's online lessons are perfect - clear, patient, and encouraging.",
    date: "2026-03-11",
    likes: 145,
    helpful: 39,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply8",
        reviewId: "rev12",
        user: "Ramon Villanueva",
        userInitials: "RV",
        reply: "So glad you're enjoying it! Music is our heritage. Keep playing! 🎵",
        date: "2026-03-12",
        isMentor: true,
        likes: 28,
      }
    ]
  },

  // Reviews for Folk Dance Course
  {
    id: "rev13",
    courseId: "filipino-folk-dance",
    user: "Grace Aquino",
    userInitials: "GA",
    rating: 5,
    title: "So fun! Great workout too!",
    comment: "Learned Tinikling in just a few weeks. Not only did I learn the dance, but I got a great workout too! Highly recommend for anyone wanting to learn.",
    date: "2026-03-09",
    likes: 178,
    helpful: 45,
    isVerifiedPurchase: true,
    replies: []
  },

  // Reviews for Weaving Masterclass
  {
    id: "rev14",
    courseId: "weaving-masterclass",
    user: "Sophia Garcia",
    userInitials: "SG",
    rating: 5,
    title: "Masterful teaching",
    comment: "Ana is truly a master of her craft. The level of detail in this course is incredible. I've started my own weaving business thanks to her!",
    date: "2026-03-06",
    likes: 234,
    helpful: 61,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply9",
        reviewId: "rev14",
        user: "Ana Cruz",
        userInitials: "AC",
        reply: "This brought tears to my eyes! So proud of you! Keep our traditions alive. 💕",
        date: "2026-03-07",
        isMentor: true,
        likes: 78,
      }
    ]
  },

  // Reviews for Business Filipino
  {
    id: "rev15",
    courseId: "filipino-business",
    user: "Thomas Chen",
    userInitials: "TC",
    rating: 5,
    title: "Essential for professionals",
    comment: "My company does business in Manila and this course has been invaluable. My Filipino colleagues appreciate that I'm learning their language properly.",
    date: "2026-03-04",
    likes: 156,
    helpful: 43,
    isVerifiedPurchase: true,
    replies: [
      {
        id: "reply10",
        reviewId: "rev15",
        user: "Maria Santos",
        userInitials: "MS",
        reply: "Professional success comes from building genuine connections. Great work Thomas!",
        date: "2026-03-05",
        isMentor: true,
        likes: 37,
      }
    ]
  },
];

// Helper function to get reviews for a specific course
export const getReviewsByCourseId = (courseId: string): Review[] => {
  return mockReviews.filter(review => review.courseId === courseId);
};

// Helper function to get average rating for a course
export const getAverageRating = (courseId: string): number => {
  const courseReviews = getReviewsByCourseId(courseId);
  if (courseReviews.length === 0) return 0;
  const sum = courseReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / courseReviews.length;
};

// Helper function to get rating distribution for a course
export const getRatingDistribution = (courseId: string) => {
  const courseReviews = getReviewsByCourseId(courseId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  courseReviews.forEach(review => {
    const rating = Math.floor(review.rating);
    distribution[rating as keyof typeof distribution]++;
  });
  
  return distribution;
};