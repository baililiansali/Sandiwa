import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { addArticle } from "@/stores/encyclopediaStore";
import { AuthGuard } from "@/components/AuthGuard";
import { ArrowLeft, Save, X, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/mentor/encyclopedia/create")({
  component: CreateArticlePage,
});

function CreateArticlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Language",
    summary: "",
    content: "",
    image: "",
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState("");

  const categories = ["Language", "Arts & Culture", "Arts & Crafts", "Values", "Cuisine", "History", "Music & Dance"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const currentUser = user;
      
      const newArticle = {
        id: `article_${Date.now()}`,
        ...formData,
        authorId: currentUser?.id || "current-user-id",
        authorName: currentUser?.name || "Current User",
        authorRole: "Mentor",
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: `${Math.ceil(formData.content.split(/\s+/).length / 200)} min`,
        views: 0,
        status: "published" as const,
      };
      
      // Add to store
      addArticle(newArticle);
      
      // Navigate to the new article - FIXED: Use relative path
      navigate({ to: "/mentor/encyclopedia/$articleId", params: { articleId: newArticle.id } });
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <div className="bg-cream min-h-screen">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => navigate({ to: "/mentor/encyclopedia" })}
                className="inline-flex items-center gap-2 text-sm text-gold hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Encyclopedia
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="font-serif text-3xl font-bold text-navy mb-6">Write New Article</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title..."
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Summary *
                  </label>
                  <textarea
                    name="summary"
                    required
                    rows={3}
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Brief summary of the article..."
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-lg overflow-hidden h-32 w-full">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags (e.g., Tradition, Festival)"
                      className="flex-1 rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 text-sm bg-gold/10 text-gold px-2 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content - Plain text version */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Description *
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={15}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your article description here..."
                    className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Write a detailed description of your article. Plain text only.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gold text-white py-3 rounded-lg font-medium hover:bg-gold/90 transition disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    {isSubmitting ? "Publishing..." : "Publish Article"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/mentor/encyclopedia" })}
                    className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}