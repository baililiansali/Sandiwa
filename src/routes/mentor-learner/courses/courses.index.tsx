import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { courses } from "@/data/mockCourses";
import { Search, Filter, Star, Users, ArrowRight, Calendar, ArrowUpDown, X } from "lucide-react";
import { useState } from "react";
import { isNewCourse, formatRelativeTime } from "@/utils/dateUtils";

export const Route = createFileRoute("/mentor-learner/courses/courses/")({
    head: () => ({
        meta: [
            { title: "Explore All Courses — Sandiwa" },
            { name: "description", content: "Browse our growing library of courses on Filipino language, culture, history, and more." },
        ],
    }),
    component: CoursesPage,
});

function CoursesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "price_low" | "price_high">("newest");
    const [priceRange, setPriceRange] = useState<"all" | "under500" | "500to1000" | "over1000">("all");
    
    const categories = ["all", ...Array.from(new Set(courses.map((c) => c.category)))];

    // First filter by search, category, and price
    const filtered = courses.filter((c) => {
        // Category filter
        if (category !== "all" && c.category !== category) return false;
        
        // Search filter
        if (search !== "" && !c.title.toLowerCase().includes(search.toLowerCase()) && 
            !c.mentor.toLowerCase().includes(search.toLowerCase())) return false;
        
        // Price filter
        if (priceRange !== "all") {
            if (priceRange === "under500" && c.price >= 500) return false;
            if (priceRange === "500to1000" && (c.price < 500 || c.price > 1000)) return false;
            if (priceRange === "over1000" && c.price <= 1000) return false;
        }
        
        return true;
    });

    // Then sort the filtered results
    const sortedCourses = [...filtered].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "price_low") {
            return a.price - b.price;
        }
        if (sortBy === "price_high") {
            return b.price - a.price;
        }
        // popular - sort by enrolled count
        return b.enrolled - a.enrolled;
    });

    const getPriceRangeText = (range: string) => {
        switch (range) {
            case "under500": return "Under ₱500";
            case "500to1000": return "₱500 - ₱1,000";
            case "over1000": return "Over ₱1,000";
            default: return "All Prices";
        }
    };

    const clearSearch = () => {
        setSearch("");
    };

    const clearAllFilters = () => {
        setSearch("");
        setCategory("all");
        setPriceRange("all");
        setSortBy("newest");
    };

    const activeFilterCount = (category !== "all" ? 1 : 0) + (priceRange !== "all" ? 1 : 0);

    return (
        <AuthGuard>
            <MentorDashboardLayout>
                {/* Hero Section */}
                <section className="bg-cream py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-gold">Our Courses</p>
                        <h1 className="mt-3 font-serif text-5xl font-bold text-navy">Explore All Courses</h1>
                        <p className="mt-4 text-muted-foreground">
                            Browse our growing library of courses on Filipino language, culture, history, and more.
                        </p>
                        <div className="mt-8 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search courses by title or mentor..."
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
                        {/* Left side - Category Filter */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                                {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                            </select>
                            
                            {/* Price Filter Dropdown */}
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                                <option value="all">All Prices</option>
                                <option value="under500">Under ₱500</option>
                                <option value="500to1000">₱500 - ₱1,000</option>
                                <option value="over1000">Over ₱1,000</option>
                            </select>
                        </div>

                        {/* Right side - Sort Dropdown */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-40"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters - Only for Category and Price, NOT for search */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="text-xs text-muted-foreground">Active filters:</span>
                            {category !== "all" && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                                    {category}
                                    <button onClick={() => setCategory("all")} className="hover:text-red-500">×</button>
                                </span>
                            )}
                            {priceRange !== "all" && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                                    {getPriceRangeText(priceRange)}
                                    <button onClick={() => setPriceRange("all")} className="hover:text-red-500">×</button>
                                </span>
                            )}
                            <button onClick={() => {
                                setCategory("all");
                                setPriceRange("all");
                            }} className="text-xs text-gold hover:underline">
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    <p className="mt-4 text-sm text-muted-foreground">
                        Found {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}
                    </p>
                </section>

                {/* Courses Grid */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedCourses.map((course) => {
                            const isNew = isNewCourse(course.createdAt);
                            
                            return (
                                <Link
                                    key={course.id}
                                    to="/mentor-learner/courses/courses/$courseId"
                                    params={{ courseId: course.id }}
                                    className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                        {course.badge && (
                                            <span className="absolute left-3 top-3 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                                                {course.badge}
                                            </span>
                                        )}
                                        {isNew && !course.badge && (
                                            <span className="absolute left-3 top-3 z-10 rounded-md bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">
                                                New
                                            </span>
                                        )}
                                        <img 
                                            src={course.image} 
                                            alt={course.title} 
                                            loading="lazy" 
                                            width={800} 
                                            height={600} 
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2">{course.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">by {course.mentor}</p>
                                        
                                        {/* Date info on course card */}
                                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatRelativeTime(course.createdAt)}
                                        </p>
                                        
                                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {course.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5" /> {course.enrolled.toLocaleString()}
                                            </span>
                                            <span>{course.hours}h</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                            <div>
                                                <span className="font-serif text-lg font-semibold text-gold">₱{course.price}</span>
                                                {course.price < 500 && (
                                                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Best Value</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gold inline-flex items-center gap-1">Learn More <ArrowRight className="h-3.5 w-3.5" /></span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {sortedCourses.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">No courses found matching your criteria.</p>
                            <button onClick={clearAllFilters} className="mt-4 text-gold hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </section>
            </MentorDashboardLayout>
        </AuthGuard>
    );
}