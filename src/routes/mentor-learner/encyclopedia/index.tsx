import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { encyclopediaArticles } from "@/data/mockEncyclopedia";
import { AuthGuard } from "@/components/AuthGuard";
import { Search, BookOpen, Eye, Calendar, Filter, ChevronDown, X, User } from "lucide-react";
import { useState } from "react";
import { mentors } from "@/data/mockMentors";

export const Route = createFileRoute("/mentor-learner/encyclopedia/")({
  head: () => ({
    meta: [
      { title: "Cultural Encyclopedia — Sandiwa" },
      { name: "description", content: "Explore Filipino culture, language, and traditions through our curated knowledge hub." },
    ],
  }),
  component: EncyclopediaPage,
});

function EncyclopediaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMentorDropdown, setShowMentorDropdown] = useState(false);

  const categories = ["Language", "Arts & Culture", "Arts & Crafts", "Values", "Cuisine", "History", "Music & Dance"];
  
  // Get all unique mentors who have written articles
  const availableMentors = mentors.filter(m => 
    encyclopediaArticles.some(a => a.authorId === m.id && a.status === "published")
  );

  // Filter articles
  const filteredArticles = encyclopediaArticles.filter(article => {
    if (article.status !== "published") return false;
    
    // Search filter
    const matchesSearch = search === "" || 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(article.category);
    
    // Mentor filter
    const matchesMentor = selectedMentors.length === 0 || 
      selectedMentors.includes(article.authorId);
    
    return matchesSearch && matchesCategory && matchesMentor;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleMentor = (mentorId: string) => {
    setSelectedMentors(prev => 
      prev.includes(mentorId) 
        ? prev.filter(m => m !== mentorId)
        : [...prev, mentorId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMentors([]);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const activeFilterCount = selectedCategories.length + selectedMentors.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-navy/5 to-gold/5 border-b border-border py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="font-serif text-5xl font-bold text-navy">Cultural Encyclopedia</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your comprehensive guide to Filipino culture, language, traditions, and heritage
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title, topic, or tag..."
                className="w-full rounded-full border border-border bg-background pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span>Category</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-md border border-border bg-background shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded border-border accent-gold"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mentor Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMentorDropdown(!showMentorDropdown)}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Author</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {showMentorDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-md border border-border bg-background shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {availableMentors.map(mentor => (
                      <label key={mentor.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMentors.includes(mentor.id)}
                          onChange={() => toggleMentor(mentor.id)}
                          className="rounded border-border accent-gold"
                        />
                        <img src={mentor.image} alt={mentor.name} className="h-6 w-6 rounded-full object-cover" />
                        <span className="text-sm">{mentor.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {selectedCategories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:text-red-500">×</button>
                </span>
              ))}
              {selectedMentors.map(mentorId => {
                const mentor = mentors.find(m => m.id === mentorId);
                return (
                  <span key={mentorId} className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                    {mentor?.name}
                    <button onClick={() => toggleMentor(mentorId)} className="hover:text-red-500">×</button>
                  </span>
                );
              })}
              <button onClick={clearFilters} className="text-xs text-gold hover:underline">
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <p className="mt-4 text-sm text-muted-foreground">
            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </p>
        </section>

        {/* Articles Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-gold hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => {
                const author = mentors.find(m => m.id === article.authorId);
                return (
                  <Link
                    key={article.id}
                    to="/mentor-learner/encyclopedia/$articleId"
                    params={{ articleId: article.id }}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-navy group-hover:text-gold transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {author && (
                            <>
                              <img 
                                src={author.image} 
                                alt={author.name} 
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              <p className="text-xs text-muted-foreground">{author.name}</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {article.views?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}