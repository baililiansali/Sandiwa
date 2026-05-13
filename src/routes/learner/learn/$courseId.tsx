import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { courses } from "@/data/mockCourses";
import { VideoPlayer } from "@/components/learner/CoursePlayer/VideoPlayer";
import { LessonSidebar } from "@/components/learner/CoursePlayer/LessonSidebar";
import { ProgressTracker } from "@/components/learner/CoursePlayer/ProgressTracker";
import { ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EnrolledCourse {
  id: string;
  progress: number;
}

export const Route = createFileRoute("/learner/learn/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  component: LearningPage,
});

function LearningPage() {
  const { course } = Route.useLoaderData();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sandiwa.enrolled");
    if (stored) {
      const enrolled: EnrolledCourse[] = JSON.parse(stored);
      const courseData = enrolled.find(c => c.id === course.id);
      if (courseData) {
        setProgress(courseData.progress || 0);
      }
    }
    
    const completed = JSON.parse(localStorage.getItem(`sandiwa.completed.${course.id}`) || "[]");
    setCompletedLessons(completed);
    
    // Find first incomplete lesson
    const firstIncomplete = course.lessons.findIndex((_, index) => !completed.includes(index));
    setCurrentLesson(firstIncomplete !== -1 ? firstIncomplete : 0);
  }, [course.id, course.lessons.length]);

  const handleLessonComplete = () => {
    const updatedCompleted = [...completedLessons, currentLesson];
    setCompletedLessons(updatedCompleted);
    
    const newProgress = Math.round((updatedCompleted.length / course.lessons.length) * 100);
    setProgress(newProgress);
    
    // Play celebration effect
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    
    // Auto-advance to next lesson if available
    if (currentLesson + 1 < course.lessons.length) {
      setTimeout(() => {
        setCurrentLesson(currentLesson + 1);
        toast.success(`Moving to next lesson: ${course.lessons[currentLesson + 1].title}`);
      }, 1500);
    } else {
      toast.success("🎉 Congratulations! You've completed the course!");
      // Show certificate prompt
      setTimeout(() => {
        if (confirm("Congratulations! You've completed the course. Would you like to download your certificate?")) {
          navigate({ to: "/learner/profile" });
        }
      }, 1000);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLesson(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic back button handler
  const handleGoBack = () => {
    // Check if there's a referrer (came from another page)
    if (document.referrer && document.referrer.includes(window.location.origin)) {
      window.history.back();
    } else {
      // Default fallback - go to courses listing
      navigate({ to: "/learner/courses/courses" });
    }
  };

  return (
    <AuthGuard>
      <SiteLayout>
        <div className="min-h-screen bg-navy/5">
          {/* Header */}
          <div className="bg-card border-b border-border sticky top-0 z-10">
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Dynamic Back Button */}
                <button 
                  onClick={handleGoBack}
                  className="text-gold hover:underline flex items-center gap-2 text-sm cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Course Progress</p>
                    <ProgressTracker progress={progress} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Lessons</p>
                    <p className="text-sm font-semibold text-navy">{completedLessons.length}/{course.lessons.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Celebration Overlay */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="bg-gold/90 text-gold-foreground rounded-full px-6 py-3 animate-bounce">
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  <span className="font-bold">Lesson Complete! 🎉</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Video Player - 2/3 width */}
              <div className="lg:col-span-2">
                <VideoPlayer
                  course={course}
                  currentLesson={currentLesson}
                  onComplete={handleLessonComplete}
                  onProgressUpdate={handleProgressUpdate}
                />
              </div>

              {/* Lesson Sidebar - 1/3 width */}
              <div className="lg:col-span-1">
                <LessonSidebar
                  course={course}
                  currentLesson={currentLesson}
                  completedLessons={completedLessons}
                  onSelectLesson={handleLessonSelect}
                />
              </div>
            </div>

            {/* Motivational Quote */}
            {progress > 0 && progress < 100 && (
              <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/20 text-center">
                <Sparkles className="h-5 w-5 text-gold inline-block mr-2" />
                <span className="text-sm text-muted-foreground">
                  You're {progress}% through this course! Keep going, {Math.round(100 - progress)}% left to complete.
                </span>
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    </AuthGuard>
  );
}