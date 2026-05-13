import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { ArrowLeft, BookOpen, Clock, Tag, Eye, Calendar as CalendarIcon, Edit, Trash2 } from "lucide-react";
import { getArticleById, getArticlesByCategory } from "@/data/mockEncyclopedia";
import { mentors } from "@/data/mockMentors";
import { courses } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { deleteArticle } from "@/stores/encyclopediaStore";

export const Route = createFileRoute("/mentor/encyclopedia/$articleId")({
  loader: ({ params }) => {
    const article = getArticleById(params.articleId);
    if (!article) throw notFound();
    return { article };
  },
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { article } = Route.useLoaderData();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const mentor = mentors.find(m => m.id === article.authorId);
  const isOwnArticle = mentor?.id === user?.id;
  
  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);
  
  const relatedCourses = courses.filter(course => 
    course.category.toLowerCase().includes(article.category.toLowerCase())
  ).slice(0, 3);

  const handleGoBack = () => {
    if (document.referrer && document.referrer.includes(window.location.origin)) {
      window.history.back();
    } else {
      // FIXED: Use the full path
      navigate({ to: "/mentor/encyclopedia" });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        deleteArticle(article.id);
        navigate({ to: "/mentor/encyclopedia" });
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <div className="bg-cream min-h-screen">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-sm text-gold hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              
              {isOwnArticle && (
                <div className="flex gap-3">
                  <Link
                    to="/mentor/encyclopedia/$articleId/edit"
                    params={{ articleId: article.id }}
                    className="inline-flex items-center gap-2 text-sm bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Article
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl overflow-hidden mb-8 shadow-lg bg-muted">
              <img src={article.image} alt={article.title} className="w-full object-cover max-h-[400px]" />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">{article.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {article.readTime} read
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold text-navy">{article.title}</h1>
            </div>

            {mentor && (
              <div className="flex items-center gap-3 py-4 border-y border-border mb-8">
                <img src={mentor.image} alt={mentor.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium">Written by</p>
                  <Link to="/learner/mentors/mentors/$mentorId" params={{ mentorId: mentor.id }} className="text-gold hover:underline font-medium">
                    {mentor.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{mentor.title}</p>
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">{article.content}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {article.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {relatedCourses.length > 0 && (
              <div className="mt-12">
                <h3 className="font-serif text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gold" />
                  Related Courses
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedCourses.map(course => (
                    <Link
                      key={course.id}
                      to="/learner/courses/courses/$courseId"
                      params={{ courseId: course.id }}
                      className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt={course.title} className="h-12 w-12 rounded-md object-cover" />
                        <div>
                          <h4 className="font-semibold text-navy group-hover:text-gold transition text-sm">{course.title}</h4>
                          <p className="text-xs text-muted-foreground">by {course.mentor}</p>
                          <p className="text-xs text-gold mt-1">₱{course.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="font-serif text-xl font-bold text-navy mb-4">Related Articles</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedArticles.map(related => (
                    <Link
                      key={related.id}
                      to="/mentor/encyclopedia/$articleId"
                      params={{ articleId: related.id }}
                      className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition group"
                    >
                      <h4 className="font-semibold text-navy group-hover:text-gold transition text-sm line-clamp-2">{related.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{related.readTime} read</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}