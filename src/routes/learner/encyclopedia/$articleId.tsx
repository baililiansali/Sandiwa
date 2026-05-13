import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { ArrowLeft, BookOpen, Clock, Tag, Eye, Calendar as CalendarIcon } from "lucide-react";
import { getArticleById, getArticlesByCategory } from "@/data/mockEncyclopedia";
import { mentors } from "@/data/mockMentors";
import { courses } from "@/data";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/learner/encyclopedia/$articleId")({
  loader: ({ params }) => {
    const article = getArticleById(params.articleId);
    if (!article) throw notFound();
    return { article };
  },
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const navigate = useNavigate();
  const { article } = Route.useLoaderData();
  
  const mentor = mentors.find(m => m.id === article.authorId);
  
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
      navigate({ to: "/learner/encyclopedia" });
    }
  };

  return (
    <AuthGuard>
      <SiteLayout>
        <div className="bg-cream min-h-screen">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Back Button */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-sm text-gold hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>

            {/* Header Image */}
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg bg-gray-100">
              <img src={article.image} alt={article.title} className="w-full object-cover max-h-[400px]" />
            </div>

            {/* Title and Meta */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-medium">{article.category}</span>
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {article.readTime} read
                </span>
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold text-navy mb-4">{article.title}</h1>
            </div>

            {/* Author Info */}
            {mentor && (
              <div className="flex items-center gap-3 py-4 border-y border-gray-200 mb-8">
                <img src={mentor.image} alt={mentor.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-gray-600">Written by</p>
                  <Link to="/learner/mentors/mentors/$mentorId" params={{ mentorId: mentor.id }} className="text-gold hover:underline font-medium">
                    {mentor.name}
                  </Link>
                  <p className="text-xs text-gray-500">{mentor.title}</p>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-950 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-500" />
                {article.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Courses */}
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
                      className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt={course.title} className="h-12 w-12 rounded-md object-cover" />
                        <div>
                          <h4 className="font-semibold text-navy group-hover:text-gold transition text-sm">{course.title}</h4>
                          <p className="text-xs text-gray-600">by {course.mentor}</p>
                          <p className="text-xs text-gold font-medium mt-1">₱{course.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="font-serif text-xl font-bold text-navy mb-4">Related Articles</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedArticles.map(related => (
                    <Link
                      key={related.id}
                      to="/learner/encyclopedia/$articleId"
                      params={{ articleId: related.id }}
                      className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition group"
                    >
                      <h4 className="font-semibold text-navy group-hover:text-gold transition text-sm line-clamp-2">{related.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{related.readTime} read</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    </AuthGuard>
  );
}