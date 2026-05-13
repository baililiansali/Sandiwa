// src/data/mockEncyclopedia.ts
export interface EncyclopediaArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorImage?: string;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  image: string;
  status: "published" | "draft" | "pending";
  views?: number;
  likes?: number;
}

// Initial data
export const initialEncyclopediaArticles: EncyclopediaArticle[] = [
  // LANGUAGE CATEGORY
  {
    id: "1",
    title: "The Filipino Language (Tagalog)",
    summary: "An overview of the national language of the Philippines, its origins, and characteristics.",
    content: `
      The Filipino Language (Tagalog)
      
      Overview
      Filipino is the national language of the Philippines. It is based on Tagalog, which is native to the Manila region and surrounding provinces. Filipino serves as a lingua franca that enables communication across the archipelago's diverse linguistic groups.
      
      Historical Development
      Tagalog has been written using the Baybayin script since at least the 16th century. Spanish colonization introduced the Latin alphabet and contributed thousands of loanwords. In 1937, Tagalog was selected as the basis of the national language, which was later renamed "Pilipino" and eventually "Filipino."
      
      Linguistic Features
      Filipino follows a verb-subject-object (VSO) word order and uses a complex system of affixes to indicate tense, aspect, and focus. It has 20 phonemes: 16 consonants and 5 vowels. The language is known for its reduplication patterns and use of markers like "ang" and "nga".
      
      Dialects and Variations
      While Tagalog is the base, Filipino incorporates vocabulary from other Philippine languages such as Cebuano, Ilocano, Hiligaynon, and foreign languages like English, Spanish, Chinese, and Arabic.
      
      Modern Usage
      Today, Filipino is taught in all schools and used in government, media, and business alongside English. Code-switching between Filipino and English, known as "Taglish," is common in urban areas and informal settings.
      
      Common Phrases
        Kamusta – Hello / How are you?
        Salamat – Thank you
        Walang anuman – You're welcome
        Paalam – Goodbye
        Oo / Hindi – Yes / No
    `,
    category: "Language",
    authorId: "maria-santos",
    authorName: "Maria Santos",
    authorRole: "Filipino Language Expert",
    readTime: "8 min",
    publishedAt: "2026-03-15",
    tags: ["language", "tagalog", "filipino", "linguistics", "grammar"],
    image: "https://picsum.photos/id/20/800/450",
    status: "published",
    views: 12450,
  },
  {
    id: "6",
    title: "Baybayin: The Ancient Filipino Script",
    summary: "Learn about the pre-colonial writing system of the Philippines and its modern revival.",
    content: `
      <h1>Baybayin: The Ancient Filipino Script</h1>
      
      <h2>What is Baybayin?</h2>
      <p>Baybayin is an ancient script used by Filipinos before Spanish colonization. It is a syllabic writing system, meaning each character represents a syllable rather than a single letter.</p>
      
      <h2>Historical Background</h2>
      <p>Baybayin was widely used in Luzon and other parts of the Philippines during the 16th and 17th centuries. It is believed to have descended from the Brahmic scripts of India and is related to other Southeast Asian scripts like Javanese and Balinese.</p>
      
      <h2>How It Works</h2>
      <p>The script consists of 14 consonants (katinig) and 3 vowels (patinig). Each consonant character has an inherent "a" sound. A diacritical mark (kudlit) is used to change the vowel sound to "i" or "u" or to remove the vowel sound entirely.</p>
      
      <h2>Modern Revival</h2>
      <p>Today, Baybayin is experiencing a cultural resurgence. It appears on Philippine passports, artwork, tattoos, and merchandise as a symbol of national identity and cultural pride.</p>
      
      <h2>Basic Characters</h2>
      <ul>
        <li>ᜀ (a) - ᜁ (i) - ᜂ (u) - Vowels</li>
        <li>ᜃ (ka) - ᜄ (ga) - ᜅ (nga) - Velar consonants</li>
        <li>ᜆ (ta) - ᜇ (da) - ᜈ (na) - Dental consonants</li>
        <li>ᜉ (pa) - ᜊ (ba) - ᜋ (ma) - Labial consonants</li>
      </ul>
      
      <h2>Learning Resources</h2>
      <p>Several online resources and mobile apps are available for learning Baybayin. Many cultural organizations offer workshops on reading and writing the ancient script.</p>
    `,
    category: "Language",
    authorId: "maria-santos",
    authorName: "Maria Santos",
    authorRole: "Filipino Language Expert",
    readTime: "6 min",
    publishedAt: "2026-04-01",
    tags: ["language", "baybayin", "script", "writing", "history"],
    image: "https://picsum.photos/id/24/800/450",
    status: "published",
    views: 8234,
  },
  // CULTURE & TRADITIONS CATEGORY
  {
    id: "2",
    title: "Tinikling: The National Dance of the Philippines",
    summary: "Discover the origins, movements, and cultural significance of this iconic Filipino folk dance.",
    content: `
      <h1>Tinikling: The National Dance of the Philippines</h1>
      
      <h2>What is Tinikling?</h2>
      <p>Tinikling is one of the most popular and iconic folk dances of the Philippines. It is named after the tikling bird, known for its graceful movements as it dodges bamboo traps set by farmers.</p>
      
      <h2>Origins</h2>
      <p>The dance originated in the Visayan islands, particularly in Leyte. Farmers would imitate the bird's movements as it skillfully stepped over bamboo traps.</p>
      
      <h2>The Dance Movements</h2>
      <p>Dancers skillfully step over and between bamboo poles that are tapped together in rhythm. The dance requires agility, coordination, and timing, making it both challenging and visually captivating.</p>
      
      <h2>Cultural Significance</h2>
      <p>Beyond entertainment, Tinikling represents the resilience and creativity of the Filipino people. The dance is often performed at cultural festivals, school events, and international showcases of Philippine heritage.</p>
      
      <h2>How to Dance Tinikling</h2>
      <ul>
        <li>Two people tap bamboo poles on the ground and against each other</li>
        <li>Dancers step in and out of the poles in rhythm</li>
        <li>The tempo gradually increases as the dance progresses</li>
        <li>Dancers wear traditional Filipino attire (balintawak or barong tagalog)</li>
      </ul>
    `,
    category: "Arts & Culture",
    authorId: "ramon-villanueva",
    authorName: "Ramon Villanueva",
    authorRole: "Music & Dance Instructor",
    readTime: "5 min",
    publishedAt: "2026-03-10",
    tags: ["dance", "folk", "tinikling", "tradition", "culture"],
    image: "https://picsum.photos/id/28/800/450",
    status: "published",
    views: 8765,
  },
  {
    id: "5",
    title: "Bayanihan: The Filipino Spirit of Community",
    summary: "Understanding the cultural value of communal unity and cooperation in Filipino society.",
    content: `
      <h1>Bayanihan: The Filipino Spirit of Community</h1>
      
      <h2>What is Bayanihan?</h2>
      <p>Bayanihan is a core Filipino value that embodies the spirit of communal unity and cooperation. The term comes from the word "bayan" (town or community).</p>
      
      <h2>The Tradition</h2>
      <p>Historically, Bayanihan referred to the practice of neighbors helping a family move their entire house (a nipa hut) by carrying it on bamboo poles to a new location.</p>
      
      <h2>Modern Interpretations</h2>
      <p>Today, Bayanihan manifests in many ways—neighbors helping during typhoons, communities raising funds for a sick member, or volunteers packing relief goods for disaster victims.</p>
      
      <h2>Examples of Bayanihan Today</h2>
      <ul>
        <li>Community clean-up drives (Brigada Eskwela)</li>
        <li>Blood donation campaigns</li>
        <li>Disaster relief operations</li>
        <li>Scholarship fundraisers for students</li>
      </ul>
      
      <h2>Global Recognition</h2>
      <p>Bayanihan has gained international recognition as a model for community resilience and mutual aid, especially in times of crisis. It reflects the Filipino belief that working together achieves more than working alone.</p>
    `,
    category: "Values",
    authorId: "jose-reyes",
    authorName: "Jose Reyes",
    authorRole: "History Professor",
    readTime: "4 min",
    publishedAt: "2026-02-20",
    tags: ["values", "community", "bayanihan", "tradition", "culture"],
    image: "https://picsum.photos/id/96/800/450",
    status: "published",
    views: 9876,
  },
  // ARTS & CRAFTS CATEGORY
  {
    id: "3",
    title: "Traditional Filipino Weaving",
    summary: "Explore the intricate patterns and techniques of Philippine textiles.",
    content: `
      <h1>Traditional Filipino Weaving</h1>
      
      <h2>Overview</h2>
      <p>Filipino weaving is a centuries-old tradition that showcases the creativity and cultural identity of indigenous communities across the archipelago.</p>
      
      <h2>T'nalak of the T'boli</h2>
      <p>The T'boli people of South Cotabato are famous for their T'nalak weaving, made from abaca fibers. According to legend, the patterns come from dreams, and each design carries spiritual significance. Only women who have received the patterns in dreams are allowed to weave them.</p>
      
      <h2>Inabel of Ilocos</h2>
      <p>Inabel is a handwoven fabric from the Ilocos region, known for its geometric patterns and durability. It is traditionally used for blankets and clothing. The weaving process uses cotton threads and wooden looms.</p>
      
      <h2>Piña Fabric</h2>
      <p>Made from pineapple leaves, Piña is a delicate and elegant fabric used for the Barong Tagalog and other formal wear. The weaving process is labor-intensive and requires great skill. It takes about 3-4 months to weave enough fabric for one barong.</p>
      
      <h2>Preservation Efforts</h2>
      <p>Several organizations and government agencies are working to preserve traditional weaving techniques through training programs and community support.</p>
    `,
    category: "Arts & Crafts",
    authorId: "ana-cruz",
    authorName: "Ana Cruz",
    authorRole: "Traditional Arts Master",
    readTime: "7 min",
    publishedAt: "2026-03-05",
    tags: ["weaving", "textiles", "tnalak", "inabel", "pina", "crafts"],
    image: "https://picsum.photos/id/160/800/450",
    status: "published",
    views: 7654,
  },
  {
    id: "9",
    title: "The Art of Filipino Pottery",
    summary: "Learn about traditional pottery techniques passed down through generations.",
    content: `
      <h1>The Art of Filipino Pottery</h1>
      
      <h2>Overview</h2>
      <p>Filipino pottery has a rich history dating back to pre-colonial times. Pottery was essential for storing water, cooking food, and ceremonial purposes.</p>
      
      <h2>Burnay Pottery</h2>
      <p>Burnay is a traditional clay jar from Ilocos Sur, known for its durability and used for storing water and fermenting food. The jars are made from locally sourced clay and fired in kilns at high temperatures.</p>
      
      <h2>Techniques</h2>
      <p>Traditional pottery is made using a potter's wheel and kiln, with techniques passed down through generations of artisans. Modern potters combine traditional methods with contemporary designs.</p>
      
      <h2>Preservation</h2>
      <p>Several workshops and training centers in the Philippines are working to preserve traditional pottery techniques and pass them to younger generations.</p>
    `,
    category: "Arts & Crafts",
    authorId: "ana-cruz",
    authorName: "Ana Cruz",
    authorRole: "Traditional Arts Master",
    readTime: "5 min",
    publishedAt: "2026-04-12",
    tags: ["pottery", "crafts", "traditional", "burnay", "ceramics"],
    image: "https://picsum.photos/id/98/800/450",
    status: "published",
    views: 4321,
  },
  // MUSIC CATEGORY
  {
    id: "10",
    title: "Kulintang: Traditional Filipino Music",
    summary: "Discover the rich musical heritage of the kulintang ensemble.",
    content: `
      <h1>Kulintang: Traditional Filipino Music</h1>
      
      <h2>What is Kulintang?</h2>
      <p>The kulintang is a traditional Philippine musical instrument consisting of a row of small gongs laid horizontally. It is played by striking the gongs with wooden mallets.</p>
      
      <h2>Historical Background</h2>
      <p>Kulintang music has been played in the Philippines for centuries, particularly in Mindanao. It is central to many ceremonies and celebrations among the Maguindanao, Maranao, and Tausug peoples.</p>
      
      <h2>The Instrument</h2>
      <p>A kulintang set typically consists of eight gongs of graduating sizes. Each gong produces a different pitch when struck. The instrument is often accompanied by other instruments like the dabakan (drum) and agung (large gongs).</p>
      
      <h2>Cultural Significance</h2>
      <p>Kulintang music is played during weddings, festivals, and important community gatherings. The music follows complex rhythmic patterns and is passed down through oral tradition.</p>
    `,
    category: "Music & Dance",
    authorId: "ramon-villanueva",
    authorName: "Ramon Villanueva",
    authorRole: "Music & Dance Instructor",
    readTime: "6 min",
    publishedAt: "2026-04-08",
    tags: ["music", "kulintang", "instrument", "mindanao", "traditional"],
    image: "https://picsum.photos/id/29/800/450",
    status: "published",
    views: 5432,
  },
  // CUISINE CATEGORY
  {
    id: "4",
    title: "Adobo: The Unofficial National Dish",
    summary: "Learn about the history, variations, and preparation of the Philippines' most famous dish.",
    content: `
      <h1>Adobo: The Unofficial National Dish</h1>
      
      <h2>What is Adobo?</h2>
      <p>Adobo is considered the unofficial national dish of the Philippines. It refers to a cooking method where meat (usually chicken or pork) is marinated and simmered in vinegar, soy sauce, garlic, bay leaves, and black peppercorns.</p>
      
      <h2>Historical Origins</h2>
      <p>The name "adobo" comes from the Spanish word "adobar," meaning marinade. However, indigenous Filipinos had been cooking meat with vinegar and salt for preservation long before Spanish colonization.</p>
      
      <h2>Regional Variations</h2>
      <ul>
        <li><strong>Northern Luzon:</strong> Pork and chicken, cooked until dry and crispy</li>
        <li><strong>Southern Tagalog:</strong> Saucy with coconut milk (adobo sa gata)</li>
        <li><strong>Visayas:</strong> Spicier, using native bird's eye chili (siling labuyo)</li>
        <li><strong>Mindanao:</strong> May include turmeric for yellow color</li>
      </ul>
      
      <h2>Basic Recipe</h2>
      <ul>
        <li>1 kg chicken or pork, cut into pieces</li>
        <li>1/2 cup vinegar (coconut or cane vinegar)</li>
        <li>1/2 cup soy sauce</li>
        <li>8 cloves garlic, crushed</li>
        <li>3 bay leaves</li>
        <li>1 teaspoon black peppercorns</li>
      </ul>
      
      <h2>Serving Suggestions</h2>
      <p>Adobo is traditionally served with steamed white rice. Leftovers can be reheated and often taste better the next day as flavors meld.</p>
    `,
    category: "Cuisine",
    authorId: "lita-mendoza",
    authorName: "Lita Mendoza",
    authorRole: "Filipino Chef & Culinary Expert",
    readTime: "6 min",
    publishedAt: "2026-02-28",
    tags: ["cuisine", "adobo", "recipe", "filipino", "cooking"],
    image: "https://picsum.photos/id/108/800/450",
    status: "published",
    views: 9876,
  },
];

// Read-only array - use const since we're not reassigning it
export const encyclopediaArticles: EncyclopediaArticle[] = [...initialEncyclopediaArticles];

// Helper functions - these only read from the array
export const getArticlesByMentor = (mentorId: string): EncyclopediaArticle[] => {
  return encyclopediaArticles.filter(article => article.authorId === mentorId);
};

export const getPublishedArticles = (): EncyclopediaArticle[] => {
  return encyclopediaArticles.filter(article => article.status === "published");
};

export const getArticleById = (id: string): EncyclopediaArticle | undefined => {
  return encyclopediaArticles.find(article => article.id === id);
};

export const getArticlesByCategory = (category: string): EncyclopediaArticle[] => {
  if (category === "All") return getPublishedArticles();
  return encyclopediaArticles.filter(article => article.category === category && article.status === "published");
};

export const getFeaturedArticles = (limit: number = 3): EncyclopediaArticle[] => {
  return [...encyclopediaArticles]
    .filter(a => a.status === "published")
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
};