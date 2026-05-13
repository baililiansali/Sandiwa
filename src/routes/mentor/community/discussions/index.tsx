import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { useDiscussions } from "@/hooks/useDiscussions";
import { DiscussionCard } from "@/components/DiscussionCard";
import { Filter, MessageCircle, Plus, Search, X } from "lucide-react";
import { useState } from "react";

type Category = "Filipino Language" | "Heritage" | "Cuisine" | "Music & Dance" | "History" | "Arts & Crafts";

export const Route = createFileRoute("/mentor/community/discussions/")({
  head: () => ({
    meta: [
      { title: "Discussions — Sandiwa" },
      { name: "description", content: "Join conversations about Filipino language, heritage, cuisine, and more." },
    ],
  }),
  component: DiscussionsListPage,
});

function DiscussionsListPage() {
  const navigate = useNavigate();
  const { discussions } = useDiscussions();
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const categories: string[] = ["all", ...new Set(discussions.map((d) => d.category))];

  const filteredDiscussions = discussions.filter((d) => {
    if (category !== "all" && d.category !== category) return false;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.author.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleAddDiscussion = (): void => {
    navigate({ to: "/learner/community/discussions/new" });
  };

  const clearSearch = (): void => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="font-serif text-5xl font-bold text-navy">Browse Discussions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Jump into conversations happening across the community.
            </p>
            
            {/* Search Bar - Always Visible like in the mentors page */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full rounded-full border border-border bg-background py-3 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={handleAddDiscussion}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
              >
                <Plus className="h-4 w-4" />
                New Discussion
              </button>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Search results for:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-1 text-xs text-gold">
                "{searchQuery}"
                <button onClick={clearSearch} className="hover:text-red-500">×</button>
              </span>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {filteredDiscussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>

          {filteredDiscussions.length === 0 && (
            <div className="py-20 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {searchQuery 
                  ? `No discussions found matching "${searchQuery}"`
                  : "No discussions found in this category."}
              </p>
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
                >
                  <X className="h-4 w-4" />
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={handleAddDiscussion}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
                >
                  <Plus className="h-4 w-4" />
                  Start a New Discussion
                </button>
              )}
            </div>
          )}
        </section>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={handleAddDiscussion}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full bg-gold p-4 text-gold-foreground shadow-lg transition hover:bg-gold/90 sm:hidden"
          aria-label="Start new discussion"
        >
          <Plus className="h-6 w-6" />
        </button>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}