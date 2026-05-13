import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { mentors } from "@/data/mockMentors";
import { courses, type Course } from "@/data/mockCourses";
import { ArrowLeft, Star, Users, BookOpen, Award, Briefcase, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/AuthGuard";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// Define enrolled course type
interface EnrolledCourse {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  enrolledAt: string;
  progress: number;
}

export const Route = createFileRoute("/learner/mentors/mentors/$mentorId")({
    loader: ({ params }) => {
        const mentor = mentors.find((m) => m.id === params.mentorId);
        if (!mentor) throw notFound();
        return { mentor };
    },
    head: ({ loaderData }) => ({
        meta: [
            { title: `${loaderData?.mentor.name ?? "Mentor"} — Sandiwa` },
            { name: "description", content: loaderData?.mentor.bio ?? "" },
        ],
    }),
    notFoundComponent: () => (
        <SiteLayout>
            <div className="mx-auto max-w-2xl py-24 text-center">
                <h1 className="font-serif text-3xl font-bold">Mentor not found</h1>
                <Link to="/learner/mentors/mentors" className="mt-4 inline-block text-gold hover:underline">Back to mentors</Link>
            </div>
        </SiteLayout>
    ),
    component: MentorDetail,
});

function MentorDetail() {
    const navigate = useNavigate();
    const { mentor } = Route.useLoaderData();
    const mentorCourses = courses.filter((c: Course) => c.mentorId === mentor.id);
    
    // State to track enrolled courses
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

    // Load enrolled courses from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sandiwa.enrolled");
        if (stored) {
            const enrolled: EnrolledCourse[] = JSON.parse(stored);
            setEnrolledCourses(enrolled);
        }
    }, []);

    // Check if a course is enrolled and get its progress
    const getEnrolledStatus = (courseId: string) => {
        return enrolledCourses.find((c: EnrolledCourse) => c.id === courseId);
    };

    // Dynamic back button handler
    const handleGoBack = () => {
        // Check if there's a referrer (came from another page)
        if (document.referrer && document.referrer.includes(window.location.origin)) {
            window.history.back();
        } else {
            // Default fallback - go to mentors listing
            navigate({ to: "/learner/mentors/mentors" });
        }
    };

    const handleContact = () => {
        const subject = encodeURIComponent(`Question about your courses on Sandiwa`);
        const body = encodeURIComponent(
            `Hello ${mentor.name},\n\n` +
            `I'm interested in your courses and would like to ask:\n\n` +
            `[Your message here]\n\n` +
            `Thank you!\n\n` +
            `Best regards,\n` +
            `[Your name]`
        );
        window.location.href = `mailto:${mentor.email}?subject=${subject}&body=${body}`;
    };

    return (
        <AuthGuard>
            <SiteLayout>
                {/* Hero Section */}
                <section className="bg-cream border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                        {/* Dynamic Back Button */}
                        <button 
                            onClick={handleGoBack}
                            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold mb-6 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        
                        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                            {/* Avatar */}
                            <img 
                                src={mentor.image} 
                                alt={mentor.name} 
                                className="rounded-xl object-cover w-full max-w-[280px] aspect-square shadow-lg"
                            />
                            
                            {/* Info */}
                            <div>
                                <h1 className="font-serif text-4xl font-bold text-navy">{mentor.name}</h1>
                                <p className="mt-1 text-gold font-medium">{mentor.title}</p>
                                
                                {/* Stats Row */}
                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-gold text-gold" />
                                        <span className="font-semibold">{mentor.rating}</span>
                                        <span className="text-muted-foreground">rating</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-gold" />
                                        <span className="font-semibold">{parseInt(mentor.students).toLocaleString()}</span>
                                        <span className="text-muted-foreground">students</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4 text-gold" />
                                        <span className="font-semibold">{mentor.courses}</span>
                                        <span className="text-muted-foreground">courses</span>
                                    </div>
                                </div>
                                
                                {/* Bio */}
                                <p className="mt-5 text-muted-foreground leading-relaxed">{mentor.bio}</p>
                                
                                {/* Contact Button */}
                                <Button onClick={handleContact} className="mt-6 bg-gold hover:bg-gold/90 text-gold-foreground">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact Mentor
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Credentials & Skills Section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Credentials */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="h-5 w-5 text-gold" />
                                <h2 className="font-serif text-xl font-bold text-navy">Credentials</h2>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                                    <span>PhD in Philippine Studies - University of the Philippines</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                                    <span>Certified Language Instructor - TESOL Certificate</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5" />
                                    <span>National Commission for Culture and the Arts (NCCA) Partner</span>
                                </li>
                            </ul>
                        </div>

                        {/* Skills & Expertise */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="h-5 w-5 text-gold" />
                                <h2 className="font-serif text-xl font-bold text-navy">Skills & Expertise</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mentor.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Experience */}
                            <div className="mt-6 pt-4 border-t border-border">
                                <h3 className="font-semibold text-navy mb-2">Experience</h3>
                                <p className="text-sm text-muted-foreground">
                                    Over 10 years of teaching experience with thousands of successful students worldwide.
                                    Specializes in making complex topics accessible and engaging.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-navy">Courses by {mentor.name.split(' ')[0]}</h2>
                            <p className="text-sm text-muted-foreground">{mentor.courses} courses available</p>
                        </div>
                        <Link to="/learner/courses/courses" className="text-sm text-gold hover:underline">
                            View all courses →
                        </Link>
                    </div>
                    
                    {mentorCourses.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-8 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No courses yet from this mentor.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {mentorCourses.map((course: Course) => {
                                const enrolledStatus = getEnrolledStatus(course.id);
                                const isEnrolled = !!enrolledStatus;
                                const progress = enrolledStatus?.progress || 0;
                                
                                return (
                                    <div key={course.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow group">
                                        <Link to="/learner/courses/courses/$courseId" params={{ courseId: course.id }}>
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                {course.badge && (
                                                    <span className="absolute left-3 top-3 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                                                        {course.badge}
                                                    </span>
                                                )}
                                                <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2">{course.title}</h3>
                                                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {course.rating}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" /> {course.enrolled.toLocaleString()}
                                                    </span>
                                                    <span>{course.hours}h</span>
                                                </div>
                                                
                                                {/* Progress Bar for enrolled courses */}
                                                {isEnrolled && progress > 0 && (
                                                    <div className="mt-3">
                                                        <div className="flex items-center justify-between text-xs mb-1">
                                                            <span className="text-muted-foreground">Your Progress</span>
                                                            <span className="text-gold font-medium">{progress}%</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                            <div 
                                                                className="h-full rounded-full bg-gold transition-all duration-500"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                                    <div>
                                                        <span className="font-serif text-lg font-semibold text-gold">₱{course.price}</span>
                                                        {isEnrolled && (
                                                            <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                                Enrolled
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isEnrolled ? (
                                                        <Link 
                                                            to="/learner/learn/$courseId" 
                                                            params={{ courseId: course.id }}
                                                            className="inline-flex items-center gap-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            {progress > 0 ? "Continue Learning" : "Start Learning"}
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm text-gold inline-flex items-center gap-1 group-hover:underline">
                                                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </SiteLayout>
        </AuthGuard>
    );
}