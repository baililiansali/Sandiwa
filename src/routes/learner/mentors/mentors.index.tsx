import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { mentors } from "@/data/mockMentors";
import { Search, Star, Users, BookOpen, Tag, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/learner/mentors/mentors/")({
    head: () => ({
        meta: [
            { title: "Meet The Mentors — Sandiwa" },
            { name: "description", content: "Our mentors are culture enthusiasts passionate about sharing Filipino heritage with the world." },
        ],
    }),
    component: MentorsPage,
});

function MentorsPage() {
    const [search, setSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number>(0);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    
    // Get all unique tags from mentors
    const allTags = Array.from(new Set(mentors.flatMap(m => m.tags))).sort();
    
    // Filter mentors based on search, selected tags, and rating
    const filteredMentors = mentors.filter(mentor => {
        // Search filter
        const matchesSearch = search === "" ||
            mentor.name.toLowerCase().includes(search.toLowerCase()) ||
            mentor.title.toLowerCase().includes(search.toLowerCase()) ||
            mentor.bio.toLowerCase().includes(search.toLowerCase());
        
        // Tags filter - mentor must have ALL selected tags (AND logic)
        const matchesTags = selectedTags.length === 0 || 
                           selectedTags.every(tag => mentor.tags.includes(tag));
        
        // Rating filter
        const matchesRating = mentor.rating >= minRating;
        
        return matchesSearch && matchesTags && matchesRating;
    });

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearSearch = () => {
        setSearch("");
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setMinRating(0);
    };

    const activeFilterCount = selectedTags.length + (minRating > 0 ? 1 : 0);

    return (
        <AuthGuard>
            <SiteLayout>
                {/* Hero Section */}
                <section className="bg-cream py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-gold">Our Mentors</p>
                        <h1 className="mt-3 font-serif text-5xl font-bold text-navy">Meet The Mentors</h1>
                        <p className="mt-4 text-muted-foreground">
                            Learn from passionate culture enthusiasts dedicated to sharing Filipino heritage.
                        </p>
                        <div className="mt-8 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, expertise, or keywords..."
                                className="w-full rounded-full bg-background border border-border pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
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
                    <div className="flex flex-col gap-4">
                        {/* Filter Row */}
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Multi-Select Tags Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                >
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span>Filter by Expertise</span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </button>
                                
                                {showTagDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-64 rounded-md border border-border bg-background shadow-lg z-10 max-h-64 overflow-y-auto">
                                        <div className="p-2">
                                            {allTags.map(tag => (
                                                <label key={tag} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTags.includes(tag)}
                                                        onChange={() => toggleTag(tag)}
                                                        className="rounded border-border accent-gold"
                                                    />
                                                    <span className="text-sm">{tag}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rating Filter */}
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                                <option value={0}>All Ratings</option>
                                <option value={4}>4.0+ Stars</option>
                                <option value={4.5}>4.5+ Stars</option>
                                <option value={4.8}>4.8+ Stars</option>
                            </select>
                        </div>

                        {/* Active Filters - Only for Tags and Rating, NOT for search */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-muted-foreground">Active filters:</span>
                                {selectedTags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                                        {tag}
                                        <button onClick={() => toggleTag(tag)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                                {minRating > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                                        {minRating}+ Stars
                                        <button onClick={() => setMinRating(0)} className="hover:text-red-500">×</button>
                                    </span>
                                )}
                                <button onClick={clearFilters} className="text-xs text-gold hover:underline">
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Results Count */}
                        <p className="text-sm text-muted-foreground">
                            Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </section>

                {/* Mentors Grid */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMentors.map((mentor) => (
                            <Link
                                key={mentor.id}
                                to="/learner/mentors/mentors/$mentorId"
                                params={{ mentorId: mentor.id }}
                                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative">
                                    <img 
                                        src={mentor.image} 
                                        alt={mentor.name} 
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur rounded-full px-2 py-1">
                                            <Star className="h-3 w-3 fill-gold text-gold" />
                                            <span className="text-xs text-white font-medium">{mentor.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-serif text-xl font-semibold text-navy group-hover:text-gold transition-colors">
                                        {mentor.name}
                                    </h3>
                                    <p className="text-sm text-gold mt-1">{mentor.title}</p>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
                                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {mentor.students} students</span>
                                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {mentor.courses} courses</span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {mentor.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                        {mentor.tags.length > 3 && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                +{mentor.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredMentors.length === 0 && (
                        <div className="text-center py-16">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No mentors found matching your criteria.</p>
                            <button onClick={() => {
                                setSearch("");
                                setSelectedTags([]);
                                setMinRating(0);
                            }} className="mt-4 text-gold hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </section>
            </SiteLayout>
        </AuthGuard>
    );
}