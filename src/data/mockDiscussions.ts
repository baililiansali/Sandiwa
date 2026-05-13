export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: "Filipino Language" | "Heritage" | "Cuisine" | "Music & Dance" | "History" | "Arts & Crafts";
  createdAt: Date;
  replies: number;
  likes: number;
  repliesContent?: Reply[];
}

export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  isVerified?: boolean;
  isInstructor?: boolean;
  replies?: Reply[];
}

export const discussions: Discussion[] = [
  {
    id: "discussion-pronunciation",
    title: "Tips for mastering Tagalog pronunciation?",
    content:
      "I keep struggling with the 'ng' sound. It feels like it's at the back of my throat but also nasal? What helped you when you started learning? Any specific exercises or tongue positions you'd recommend?",
    author: "Ana Mercado",
    category: "Filipino Language",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    replies: 8,
    likes: 56,
    repliesContent: [
      {
        id: "reply-1",
        author: "Ramon Cruz",
        content:
          "The 'ng' sound is actually the same as the '-ing' ending in English! Think of the word 'sing' — hold that final 'ng' sound. Now try saying 'ngayon' (now) by starting with that same nasal sound.",
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likes: 12,
        isLiked: false,
        isVerified: true,
        isInstructor: false,
        replies: [
          {
            id: "reply-1-1",
            author: "Maria Santos",
            content: "That's really helpful! I never thought about it that way. Salamat!",
            createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
            likes: 5,
            isLiked: false,
            isVerified: true,
            isInstructor: true,
            replies: [
              {
                id: "reply-1-1-1",
                author: "Ramon Cruz",
                content: "Walang anuman! Happy to help fellow learners. Keep practicing and you'll get it!",
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                likes: 3,
                isLiked: false,
                isVerified: true,
                isInstructor: false,
                replies: []
              }
            ]
          },
          {
            id: "reply-1-2",
            author: "John Reyes",
            content: "This is a game changer! I've been struggling with this for weeks.",
            createdAt: new Date(Date.now() - 1.1 * 60 * 60 * 1000),
            likes: 2,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          }
        ]
      },
      {
        id: "reply-2",
        author: "Maya Santos",
        content:
          "Practice with 'ng' + vowel: nga, nge, ngi, ngo, ngu. Place your tongue flat against the roof of your mouth and let air flow through your nose. It takes time!",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 8,
        isLiked: false,
        isVerified: false,
        isInstructor: false,
        replies: [
          {
            id: "reply-2-1",
            author: "Teacher Elena",
            content: "Excellent advice! I also recommend recording yourself and comparing with native speakers.",
            createdAt: new Date(Date.now() - 0.8 * 60 * 60 * 1000),
            likes: 6,
            isLiked: false,
            isVerified: true,
            isInstructor: true,
            replies: []
          }
        ]
      },
      {
        id: "reply-3",
        author: "Carlos Mendoza",
        content: "Try watching Tagalog movies with subtitles. Hearing the 'ng' sound in context really helped me!",
        createdAt: new Date(Date.now() - 0.7 * 60 * 60 * 1000),
        likes: 4,
        isLiked: false,
        isVerified: false,
        isInstructor: false,
        replies: []
      },
      {
        id: "reply-4",
        author: "Dr. Josefa Santiago",
        content: "As a linguist, I can tell you that the 'ng' sound is a velar nasal. The tongue should touch the soft palate. Practice minimal pairs like 'ngayon' vs 'gayon'.",
        createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
        likes: 15,
        isLiked: false,
        isVerified: true,
        isInstructor: true,
        replies: [
          {
            id: "reply-4-1",
            author: "Ana Mercado",
            content: "Thank you Dr. Santiago! This is exactly the technical explanation I was looking for!",
            createdAt: new Date(Date.now() - 0.4 * 60 * 60 * 1000),
            likes: 7,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          }
        ]
      }
    ],
  },
  {
    id: "discussion-cebu-heritage",
    title: "Best heritage sites to visit in Cebu?",
    content:
      "Planning a trip to Cebu next month. I'm really interested in pre-colonial history and early Spanish contact sites. Looking for must-visit cultural and historical landmarks beyond the usual tourist spots.",
    author: "Marco Dela Cruz",
    category: "Heritage",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    replies: 3,
    likes: 42,
    repliesContent: [
      {
        id: "reply-5",
        author: "Isabella Reyes",
        content: "Don't miss the Yap-Sandiego Ancestral House! It's one of the oldest residential houses in the Philippines and gives a glimpse into colonial life.",
        createdAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
        likes: 15,
        isLiked: false,
        isVerified: true,
        isInstructor: false,
        replies: [
          {
            id: "reply-5-1",
            author: "Marco Dela Cruz",
            content: "Thanks! I'll add that to my itinerary. Is it easy to get there from the city center?",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            likes: 2,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          },
          {
            id: "reply-5-2",
            author: "Isabella Reyes",
            content: "Yes! It's in the Parian district, near Colon Street. Very accessible by taxi or jeepney.",
            createdAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000),
            likes: 3,
            isLiked: false,
            isVerified: true,
            isInstructor: false,
            replies: []
          }
        ]
      },
      {
        id: "reply-6",
        author: "Tour Guide Ben",
        content: "Fort San Pedro, Magellan's Cross, and Basilica Minore del Santo Niño are the top 3. But for hidden gems, check out the Museo Parian and Jesuit House.",
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        likes: 9,
        isLiked: false,
        isVerified: false,
        isInstructor: true,
        replies: []
      }
    ],
  },
  {
    id: "discussion-adobo",
    title: "Authentic adobo recipe variations?",
    content:
      "What regional variations of adobo have you tried? I'm doing a cooking project and want to document different styles. My lola's version from Batangas uses coconut milk and has a slightly creamy, tangy flavor. What makes your family's adobo unique?",
    author: "Joana Lim",
    category: "Cuisine",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    replies: 5,
    likes: 78,
    repliesContent: [
      {
        id: "reply-7",
        author: "Chef Antonio",
        content: "In Manila, we do the classic soy sauce + vinegar + garlic + bay leaves. In Pampanga, they add pork liver for a richer flavor!",
        createdAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
        likes: 25,
        isLiked: false,
        isVerified: true,
        isInstructor: true,
        replies: [
          {
            id: "reply-7-1",
            author: "Joana Lim",
            content: "Interesting! I've never tried it with liver. Will definitely experiment with that!",
            createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
            likes: 3,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          }
        ]
      },
      {
        id: "reply-8",
        author: "Lola Maria",
        content: "My version from Quezon uses 'siling labuyo' (bird's eye chili) for extra kick. We also add 'pinya' (pineapple) for a sweet and sour twist!",
        createdAt: new Date(Date.now() - 6.8 * 60 * 60 * 1000),
        likes: 18,
        isLiked: false,
        isVerified: false,
        isInstructor: false,
        replies: []
      },
      {
        id: "reply-9",
        author: "Foodie Carla",
        content: "In Bicol, we use coconut milk (gata) and turmeric (luyang dilaw) for a yellow adobo. It's creamy and absolutely delicious!",
        createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
        likes: 12,
        isLiked: false,
        isVerified: false,
        isInstructor: false,
        replies: [
          {
            id: "reply-9-1",
            author: "Joana Lim",
            content: "That sounds amazing! Do you have a recipe you could share?",
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            likes: 4,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          },
          {
            id: "reply-9-2",
            author: "Foodie Carla",
            content: "Absolutely! 1 cup coconut milk, 1/2 cup vinegar, 1/4 cup soy sauce, 1 tbsp turmeric powder, garlic, peppercorns. Cook low and slow!",
            createdAt: new Date(Date.now() - 5.8 * 60 * 60 * 1000),
            likes: 7,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          }
        ]
      }
    ],
  },
  {
    id: "discussion-tinikling",
    title: "Learning Tinikling as an adult — possible?",
    content:
      "Started lessons last week. Feel free to get in the way! The bamboo clapping is terrifying but exhilarating. Has anyone here learned traditional Filipino folk dance as an adult? Any tips for not getting your ankles snapped?",
    author: "Ben Aquino",
    category: "Music & Dance",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    replies: 4,
    likes: 33,
    repliesContent: [
      {
        id: "reply-10",
        author: "Dance Instructor Lisa",
        content: "I started at 35! Wear thick socks and practice with just the rhythm first before adding the bamboo. Start slow - the '2 slow, 1 fast' pattern.",
        createdAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
        likes: 14,
        isLiked: false,
        isVerified: true,
        isInstructor: true,
        replies: [
          {
            id: "reply-10-1",
            author: "Ben Aquino",
            content: "Thank you! That gives me hope. How long did it take you to feel comfortable?",
            createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
            likes: 2,
            isLiked: false,
            isVerified: false,
            isInstructor: false,
            replies: []
          },
          {
            id: "reply-10-2",
            author: "Dance Instructor Lisa",
            content: "About 2 months of regular practice. Don't rush it - muscle memory takes time!",
            createdAt: new Date(Date.now() - 10.8 * 60 * 60 * 1000),
            likes: 5,
            isLiked: false,
            isVerified: true,
            isInstructor: true,
            replies: []
          }
        ]
      },
      {
        id: "reply-11",
        author: "Mark Rivera",
        content: "Watch your foot placement - keep feet close to the ankles. And trust the rhythm! Your feet learn faster than your brain.",
        createdAt: new Date(Date.now() - 10.5 * 60 * 60 * 1000),
        likes: 8,
        isLiked: false,
        isVerified: false,
        isInstructor: false,
        replies: []
      },
      {
        id: "reply-12",
        author: "Teacher Amor",
        content: "Start with music only (no bamboo) until you master the steps. Add bamboo slowly. The secret is in the knees - keep them bouncy and relaxed!",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        likes: 11,
        isLiked: false,
        isVerified: true,
        isInstructor: true,
        replies: []
      }
    ],
  },
];

export const formatDiscussionDate = (date: Date | string): string => {
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Just now";
  }
  
  const diffMs = Date.now() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''} ago`;
};