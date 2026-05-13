import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuth } from "@/hooks/useAuth";

type Category = "Filipino Language" | "Heritage" | "Cuisine" | "Music & Dance" | "History" | "Arts & Crafts";

export const Route = createFileRoute("/mentor/community/discussions/new")({
  head: () => ({
    meta: [
      { title: "Start a Discussion — Sandiwa" },
      { name: "description", content: "Share your thoughts and questions with the community." },
    ],
  }),
  component: NewDiscussionPage,
});

function NewDiscussionPage() {
  const navigate = useNavigate();
  const { addDiscussion } = useDiscussions();
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<Category>("Filipino Language");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories: Category[] = ["Filipino Language", "Heritage", "Cuisine", "Music & Dance", "History", "Arts & Crafts"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    setIsSubmitting(true);
    
    // Add the new discussion with the user's name from profile
    addDiscussion({
      title: title.trim(),
      content: content.trim(),
      author: user?.name || "Culture Enthusiast",
      category: category,
    });

    toast.success("Discussion posted successfully!");
    
    // Navigate back to discussions list
    setTimeout(() => {
      navigate({ to: "/learner/community/discussions" });
    }, 500);
  };

  const handleGoBack = (): void => {
    // Go back to previous page (where the user came from)
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/learner/community/discussions" });
    }
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <section className="bg-cream py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h1 className="font-serif text-3xl font-bold text-navy">Start a New Discussion</h1>
              <p className="mt-2 text-muted-foreground">
                Share your thoughts, ask questions, or start a conversation with the community.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="e.g., Tips for mastering Tagalog pronunciation?"
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as Category)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="Share your question, insight, or experience..."
                    rows={8}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={2000}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {content.length}/2000 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold text-gold-foreground hover:bg-gold/90"
                  >
                    {isSubmitting ? "Posting..." : "Post Discussion"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}