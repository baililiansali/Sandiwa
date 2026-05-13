import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorLearnerDashboardLayout } from "@/components/MentorLearnerDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { courses } from "@/data/mockCourses";
import { mentors } from "@/data/mockMentors";
import { notifications } from "@/data/notifications";
import { Star, Users, BookOpen, Clock, ArrowRight, Trophy, Bell, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Types for enrolled courses
interface EnrolledCourse {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  enrolledAt: string;
  progress: number;
}

export const Route = createFileRoute("/mentor-learner/dashboard")({
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
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Load enrolled courses with progress from localStorage
    useEffect(() => {
        const storedProgress = localStorage.getItem("sandiwa.enrolled");
        const enrolledData = storedProgress ? JSON.parse(storedProgress) : [];
        
        const coursesWithProgress = enrolledData.map((enrolled: EnrolledCourse) => {
            const course = courses.find(c => c.id === enrolled.id);
            if (course) {
                return {
                    id: course.id,
                    title: course.title,
                    mentor: course.mentor,
                    image: course.image,
                    price: course.price,
                    enrolledAt: enrolled.enrolledAt,
                    progress: enrolled.progress || 0
                };
            }
            return null;
        }).filter(Boolean);
        
        setEnrolledCourses(coursesWithProgress);
        
        const unread = notifications.filter(n => n.unread).length;
        setUnreadCount(unread);
    }, []);
    
    // Calculate stats
    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
    const totalLearningHours = enrolledCourses.reduce((total, course) => {
        const courseData = courses.find(c => c.id === course.id);
        if (courseData) {
            const completedHours = (course.progress / 100) * courseData.hours;
            return total + completedHours;
        }
        return total;
    }, 0);
    const averageProgress = enrolledCourses.length > 0 
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
        : 0;
    
    // Get courses
    const popularCourses = courses.filter(c => c.badge === "Bestseller" || c.rating >= 4.8).slice(0, 3);
    const newCourses = courses.filter(c => c.badge === "New").slice(0, 3);
    const featuredMentors = mentors.slice(0, 4);
    const enrolledIds = enrolledCourses.map(c => c.id);
    const recommendedCourses = courses.filter(c => !enrolledIds.includes(c.id)).slice(0, 4);

    return (
        <AuthGuard>
            <MentorLearnerDashboardLayout>
                {/* Welcome Section */}
                <section className="bg-gradient-to-r from-navy/5 to-gold/5 border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="font-serif text-4xl font-bold text-navy">
                            Welcome back, <span className="text-gold">{firstName}!</span>
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Continue your journey into Filipino language and culture. Here's what's new today.
                        </p>
                        {unreadCount > 0 && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm">
                                <Bell className="h-4 w-4" />
                                <span>You have {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</span>
                            </div>
                        )}
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
                                    <p className="text-2xl font-serif font-bold">{enrolledCourses.length}</p>
                                    <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-serif font-bold">{Math.round(totalLearningHours)}h</p>
                                    <p className="text-xs text-muted-foreground">Learning Hours</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-serif font-bold">{completedCourses}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-serif font-bold">{averageProgress}%</p>
                                    <p className="text-xs text-muted-foreground">Avg. Progress</p>
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
                        <Link to="/mentor-learner/courses/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {popularCourses.map((course) => (
                            <Link
                                key={course.id}
                                to="/mentor-learner/courses/courses/$courseId"
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
                            <Link to="/mentor-learner/courses/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {newCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    to="/mentor-learner/courses/courses/$courseId"
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
                        <Link to="/mentor-learner/mentors/mentors" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {featuredMentors.map((mentor) => (
                            <Link
                                key={mentor.id}
                                to="/mentor-learner/mentors/mentors/$mentorId"
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
                                <p className="text-sm text-muted-foreground">Personalized picks based on your interests</p>
                            </div>
                            <Link to="/mentor-learner/courses/courses" className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {recommendedCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    to="/mentor-learner/courses/courses/$courseId"
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
                    <h2 className="font-serif text-2xl font-bold text-navy mb-6">Continue Learning</h2>
                    {enrolledCourses.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-8 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                            <Button asChild className="mt-4 bg-gold hover:bg-gold/90">
                                <Link to="/mentor-learner/courses/courses">Browse Courses</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {enrolledCourses.slice(0, 4).map((course) => (
                                <div key={course.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-navy">{course.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">by {course.mentor}</p>
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="text-gold font-medium">{course.progress}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-gold transition-all duration-500"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <Link 
                                                to="/mentor-learner/learn/$courseId" 
                                                params={{ courseId: course.id }}
                                                className="inline-block mt-3 text-sm text-gold hover:underline"
                                            >
                                                {course.progress > 0 ? "Continue Learning →" : "Start Learning →"}
                                            </Link>
                                        </div>
                                        <img src={course.image} alt={course.title} className="h-16 w-16 rounded-md object-cover ml-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {enrolledCourses.length > 4 && (
                        <div className="text-center mt-4">
                            <Link to="/mentor-learner/profile" className="text-sm text-gold hover:underline">
                                View all {enrolledCourses.length} courses →
                            </Link>
                        </div>
                    )}
                </section>
            </MentorLearnerDashboardLayout>
        </AuthGuard>
    );
}