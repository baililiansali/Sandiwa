import { createFileRoute, Link, notFound, useNavigate, useLocation } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { CourseReviews } from "@/components/CourseReviews";
import { courses } from "@/data/mockCourses";
import { mentors } from "@/data/mockMentors";
import { ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle2, Play, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { formatDate, formatRelativeTime, isNewCourse, isRecentlyUpdated } from "@/utils/dateUtils";

// Define the structure for enrolled course data
interface EnrolledCourseData {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  enrolledAt: string;
  progress: number;
}

// Define lesson type
interface Lesson {
  title: string;
  minutes: number;
}

export const Route = createFileRoute("/learner/courses/courses/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — Sandiwa` },
      { name: "description", content: loaderData?.course.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Course not found</h1>
        <Link to="/learner/courses/courses" className="mt-4 inline-block text-gold hover:underline">
          Back 
        </Link>
      </div>
    </SiteLayout>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const mentor = mentors.find((m) => m.id === course.mentorId);
  const navigate = useNavigate();
  const location = useLocation();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);

  // Date calculations
  const isNew = isNewCourse(course.createdAt);
  const isUpdated = isRecentlyUpdated(course.updatedAt);

  // Check if already enrolled
  useEffect(() => {
    const storedData = localStorage.getItem("sandiwa.enrolled");
    const enrolledCourses: EnrolledCourseData[] = storedData ? JSON.parse(storedData) : [];
    const enrolled = enrolledCourses.find((c: EnrolledCourseData) => c.id === course.id);
    if (enrolled) {
      setIsEnrolled(true);
      setEnrollmentProgress(enrolled.progress || 0);
    }
  }, [course.id]);

  const handleEnrollNow = () => {
    const storedData = localStorage.getItem("sandiwa.enrolled");
    const enrolledCourses: EnrolledCourseData[] = storedData ? JSON.parse(storedData) : [];
    const alreadyEnrolled = enrolledCourses.find((c: EnrolledCourseData) => c.id === course.id);
    
    if (alreadyEnrolled) {
      navigate({ to: "/learner/learn/$courseId", params: { courseId: course.id } });
      return;
    }
    
    cart.add(course);
    navigate({ to: "/learner/checkout" });
  };

  const handleContinueLearning = () => {
    navigate({ to: "/learner/learn/$courseId", params: { courseId: course.id } });
  };

  // Get the previous page from document.referrer or state
  const handleGoBack = () => {
    // Check if there's a referrer (came from another page)
    if (document.referrer && document.referrer.includes(window.location.origin)) {
      window.history.back();
    } else {
      // Default fallback - go to courses listing
      navigate({ to: "/learner/courses/courses" });
    }
  };

  const ratingNumber = course.rating;
  const reviewCount = course.reviewCount || Math.floor(course.enrolled * 0.3);

  return (
    <AuthGuard>
      <SiteLayout>
        {/* Hero Section */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Dynamic Back Button */}
            <button 
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="mt-6 grid gap-10 lg:grid-cols-2 items-center">
              <div>
                {course.badge && (
                  <span className="inline-block rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                    {course.badge}
                  </span>
                )}
                <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy leading-tight">
                  {course.title}
                </h1>
                
                {/* Date Badges */}
                <div className="flex items-center gap-2 mt-3">
                  {isNew && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <Calendar className="h-3 w-3" /> New
                    </span>
                  )}
                  {isUpdated && !isNew && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      <RefreshCw className="h-3 w-3" /> Recently Updated
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Created {formatRelativeTime(course.createdAt)}
                  </span>
                </div>

                <p className="mt-5 text-muted-foreground max-w-xl">{course.description}</p>
                <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {course.enrolled.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.hours}h
                  </span>
                </div>
                {mentor && (
                  <Link 
                    to="/learner/mentors/mentors/$mentorId" 
                    params={{ mentorId: mentor.id }} 
                    className="mt-6 inline-flex items-center gap-3 group"
                  >
                    <img 
                      src={mentor.image} 
                      alt={mentor.name} 
                      className="h-12 w-12 rounded-full object-cover" 
                      width={48} 
                      height={48} 
                      loading="lazy" 
                    />
                    <div>
                      <p className="font-medium text-navy group-hover:text-gold">{mentor.name}</p>
                      <p className="text-xs text-gold">{mentor.title}</p>
                    </div>
                  </Link>
                )}
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-xl">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="h-full w-full object-cover" 
                  width={1280} 
                  height={720} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    aria-label="Play preview" 
                    className="h-16 w-16 rounded-full bg-gold/90 hover:bg-gold text-gold-foreground flex items-center justify-center shadow-lg"
                  >
                    <Play className="h-7 w-7 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left Column - Course Content (2/3 width) */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-navy">What You'll Learn</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((outcome: string) => (
                    <div key={outcome} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-semibold text-navy">Course Content</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course.lessons.length} lessons • {course.hours}h total
                </p>
                <ul className="mt-5 divide-y divide-border rounded-xl border border-border bg-card">
                  {course.lessons.map((lesson: Lesson, index: number) => (
                    <li key={lesson.title} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="text-sm text-navy">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{lesson.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Course Sidebar (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-xl border border-border bg-cream p-6">
                  <p className="font-serif text-4xl font-bold text-navy">₱{course.price}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= ratingNumber ? 'fill-gold text-gold' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  
                  {isEnrolled ? (
                    <>
                      <div className="mt-3 mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-gold font-medium">{enrollmentProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gold transition-all duration-500"
                            style={{ width: `${enrollmentProgress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        className="mt-5 w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                        size="lg"
                        onClick={handleContinueLearning}
                      >
                        {enrollmentProgress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="mt-5 w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                        size="lg"
                        onClick={handleEnrollNow}
                      >
                        Enroll Now
                      </Button>
                      <Button
                        variant="outline"
                        className="mt-3 w-full"
                        size="lg"
                        onClick={() => {
                          cart.add(course);
                          toast.success(`${course.title} added to cart`);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                  
                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground border-t border-border pt-5">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {course.hours}h of content
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> {course.lessons.length} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} enrolled
                    </li>
                  </ul>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created: {formatDate(course.createdAt)}
                    </p>
                    {course.updatedAt && course.updatedAt !== course.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Last updated: {formatDate(course.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section - Full Width */}
          <div className="mt-16">
            <CourseReviews 
              courseId={course.id}
              courseTitle={course.title}
              mentorName={course.mentor}
              averageRating={ratingNumber}
              totalReviews={reviewCount}
            />
          </div>
        </section>
      </SiteLayout>
    </AuthGuard>
  );
}