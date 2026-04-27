import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { courses, mentors } from "@/data/mock";
import { Star, Users, BookOpen, TrendingUp, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sandiwa" },
      { name: "description", content: "Your personal dashboard to track learning progress and discover new courses." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Learner";
  const firstName = userName.split(" ")[0];
  
  // Get popular courses (bestseller or high rating)
  const popularCourses = courses.filter(c => c.badge === "Bestseller" || c.rating >= 4.8).slice(0, 3);
  
  // Get new courses
  const newCourses = courses.filter(c => c.badge === "New").slice(0, 3);
  
  // Get featured mentors
  const featuredMentors = mentors.slice(0, 4);
  
  // Get recommended courses (mix of popular and new)
  const recommendedCourses = [...popularCourses, ...newCourses].slice(0, 4);

  return (
    <AuthGuard>
      <SiteLayout>
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-navy/5 to-gold/5 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="font-serif text-4xl font-bold text-navy">
              Welcome back, <span className="text-gold">{firstName}!</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Continue your journey into Filipino language and culture. Here's what's new today.
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Active Courses</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold">15h</p>
                  <p className="text-xs text-muted-foreground">Learning Hours</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Certificates</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold">150</p>
                  <p className="text-xs text-muted-foreground">Community Points</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy">Popular Courses</h2>
              <p className="text-sm text-muted-foreground">Most loved by our community</p>
            </div>
            <Link to="/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularCourses.map((course) => (
              <Link
                key={course.id}
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {course.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                      {course.badge}
                    </span>
                  )}
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-navy line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">by {course.mentor}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-serif font-bold text-gold">₱{course.price}</span>
                    <span className="text-xs text-gold">Enroll Now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Courses */}
        <section className="bg-cream py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy">New Arrivals</h2>
                <p className="text-sm text-muted-foreground">Fresh courses just added</p>
              </div>
              <Link to="/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newCourses.map((course) => (
                <Link
                  key={course.id}
                  to="/courses/$courseId"
                  params={{ courseId: course.id }}
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {course.badge && (
                      <span className="absolute left-3 top-3 z-10 rounded-md bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">
                        {course.badge}
                      </span>
                    )}
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-navy line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {course.mentor}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {course.rating}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolled.toLocaleString()}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif font-bold text-gold">₱{course.price}</span>
                      <span className="text-xs text-gold">Enroll Now →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Mentors */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy">Featured Mentors</h2>
              <p className="text-sm text-muted-foreground">Learn from the best in their field</p>
            </div>
            <Link to="/mentors" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredMentors.map((mentor) => (
              <Link
                key={mentor.id}
                to="/mentors/$mentorId"
                params={{ mentorId: mentor.id }}
                className="group text-center"
              >
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name} 
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="mt-3">
                    <h3 className="font-serif font-semibold text-navy">{mentor.name}</h3>
                    <p className="text-xs text-gold">{mentor.title}</p>
                    <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {mentor.rating}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {mentor.students}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended for You */}
        <section className="bg-cream py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy">Recommended for You</h2>
                <p className="text-sm text-muted-foreground"> personalized picks based on your interests</p>
              </div>
              <Link to="/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {recommendedCourses.map((course) => (
                <Link
                  key={course.id}
                  to="/courses/$courseId"
                  params={{ courseId: course.id }}
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif font-semibold text-navy text-sm line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {course.mentor}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-serif font-bold text-gold text-sm">₱{course.price}</span>
                      <span className="text-xs text-gold">Learn More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Continue Learning Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy">Continue Your Journey</h2>
                <p className="text-muted-foreground mt-1">You're making great progress! Keep going.</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Complete Filipino Language for Beginners</span>
                    <span className="text-sm text-gold">45%</span>
                  </div>
                  <div className="mt-2 h-2 w-64 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[45%] rounded-full bg-gold" />
                  </div>
                </div>
              </div>
              <Button asChild className="bg-gold hover:bg-gold/90 text-gold-foreground">
                <Link to="/courses/filipino-beginners">Continue Learning →</Link>
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    </AuthGuard>
  );
}