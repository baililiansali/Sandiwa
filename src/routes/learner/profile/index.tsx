import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { Award, BookOpen, Mail, MapPin, Clock, Star, Users, Edit, Download, Calendar, CheckCircle, Video, CalendarDays, CreditCard, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { courses } from "@/data/mockCourses";
import { Event, formatEventDate } from "@/data/mockEvents";
import { toast } from "sonner";

export const Route = createFileRoute("/learner/profile/")({
    head: () => ({
        meta: [
            { title: "My Profile — Sandiwa" },
            { name: "description", content: "Manage your Sandiwa profile." },
        ],
    }),
    component: ProfilePage,
});

interface EnrolledCourse {
    id: string;
    title: string;
    mentor: string;
    image: string;
    price: number;
    enrolledAt: string;
    progress: number;
}

interface Certificate {
    id: string;
    courseId: string;
    courseTitle: string;
    completedAt: string;
    certificateUrl: string;
}

interface RegisteredEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    registeredAt: string;
    status: string;
    isVirtual?: boolean;
}

interface StoredEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    dateTo?: string;
    location: string;
    isVirtual?: boolean;
    price?: number;
    capacity?: number;
    registered?: number;
    image?: string;
    category: string;
    mentorId?: string;
    mentorName?: string;
}

function ProfilePage() {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([]);
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
    const [profileData, setProfileData] = useState({
        phone: "",
        location: "",
        bio: "",
        occupation: "",
        interests: [] as string[],
    });
    const [userData, setUserData] = useState({
        userName: "Juan Reyes",
        userEmail: "juan@example.com",
    });
    
    // Pagination state for courses
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    // Pagination state for registered events
    const [registeredEventsPage, setRegisteredEventsPage] = useState(1);
    const registeredEventsPerPage = 3;
    
    // Pagination state for created events
    const [createdEventsPage, setCreatedEventsPage] = useState(1);
    const createdEventsPerPage = 3;

    const loadCoursesWithProgress = () => {
        const storedProgress = localStorage.getItem("sandiwa.enrolled");
        const enrolledCoursesData = storedProgress ? JSON.parse(storedProgress) : [];
        
        const mockEnrolledCourses: EnrolledCourse[] = enrolledCoursesData.map((enrolled: { id: string; enrolledAt?: string; progress?: number }) => {
            const course = courses.find(c => c.id === enrolled.id);
            if (!course) return null;
            
            return {
                id: course.id,
                title: course.title,
                mentor: course.mentor,
                image: course.image,
                price: course.price,
                enrolledAt: enrolled.enrolledAt || new Date().toISOString(),
                progress: enrolled.progress || 0,
            };
        }).filter(Boolean) as EnrolledCourse[];
        
        setEnrolledCourses(mockEnrolledCourses);
        
        // Load certificates for completed courses
        const completed = mockEnrolledCourses.filter(c => c.progress === 100);
        const certs = completed.map(c => ({
            id: c.id,
            courseId: c.id,
            courseTitle: c.title,
            completedAt: c.enrolledAt,
            certificateUrl: `/certificates/${c.id}.pdf`,
        }));
        setCertificates(certs);
    };
    
    const loadRegisteredEvents = () => {
        const storedEvents = localStorage.getItem("sandiwa.registeredEvents");
        if (storedEvents) {
            const events_data: RegisteredEvent[] = JSON.parse(storedEvents);
            // Sort by registration date (most recent first)
            events_data.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
            setRegisteredEvents(events_data);
        } else {
            setRegisteredEvents([]);
        }
    };
    
    const loadCreatedEvents = () => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";
        const storedEvents: StoredEvent[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
        
        // Parse dates and filter events created by this user
        const parsedEvents: Event[] = storedEvents.map(event => ({
            ...event,
            date: new Date(event.date),
            dateTo: event.dateTo ? new Date(event.dateTo) : undefined,
            category: event.category as "workshop" | "meetup" | "celebration" | "conversation"
        }));
        
        const userEvents = parsedEvents.filter(event => event.mentorId === userId);
        setCreatedEvents(userEvents);
    };

    const handleDeleteEvent = (eventId: string, eventTitle: string) => {
        if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
            const storedEvents: StoredEvent[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
            const filteredEvents = storedEvents.filter(e => e.id !== eventId);
            localStorage.setItem("sandiwa.events", JSON.stringify(filteredEvents));
            
            // Refresh the list
            loadCreatedEvents();
            
            toast.success("Event deleted successfully!");
        }
    };
        
    useEffect(() => {
        const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Juan Reyes";
        const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "juan@example.com";
        setUserData({ userName, userEmail });
        
        loadCoursesWithProgress();
        loadRegisteredEvents();
        loadCreatedEvents();
        
        const profile = JSON.parse(localStorage.getItem("sandiwa.profile") || "{}");
        setProfileData(profile);
        
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "sandiwa.enrolled") {
                loadCoursesWithProgress();
            }
            if (e.key === "sandiwa.registeredEvents") {
                loadRegisteredEvents();
            }
            if (e.key === "sandiwa.events") {
                loadCreatedEvents();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Pagination for courses
    const coursesStartIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = enrolledCourses.slice(coursesStartIndex, coursesStartIndex + itemsPerPage);
    
    // Pagination for registered events
    const registeredStartIndex = (registeredEventsPage - 1) * registeredEventsPerPage;
    const paginatedRegisteredEvents = registeredEvents.slice(registeredStartIndex, registeredStartIndex + registeredEventsPerPage);
    
    // Pagination for created events
    const createdStartIndex = (createdEventsPage - 1) * createdEventsPerPage;
    const paginatedCreatedEvents = createdEvents.slice(createdStartIndex, createdStartIndex + createdEventsPerPage);

    const initials = userData.userName.split(" ").map(n => n[0]).join("").toUpperCase();

    const totalCourses = enrolledCourses.length;
    const totalLearningHours = enrolledCourses.reduce((total, course) => {
        const completedHours = (course.progress / 100) * 40;
        return total + completedHours;
    }, 0);
    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
    const averageProgress = enrolledCourses.length > 0 
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length) 
        : 0;

    const downloadCertificate = (cert: Certificate) => {
        alert(`Downloading certificate for ${cert.courseTitle}`);
    };
    
    const isEventUpcoming = (eventDate: string) => {
        return new Date(eventDate) > new Date();
    };

    const downloadReceipt = (course: EnrolledCourse) => {
        const receipt = `
╔══════════════════════════════════════════════════════════════╗
║                    SANDIWA PAYMENT RECEIPT                   ║
╠══════════════════════════════════════════════════════════════╣
║  Transaction ID: #TXN-${course.id.toUpperCase().slice(0, 8)}
║  Date:           ${new Date(course.enrolledAt).toLocaleString()}
║  Status:         PAID
╠══════════════════════════════════════════════════════════════╣
║  COURSE DETAILS
║  ──────────────────────────────────────────────────────────
║  Course:         ${course.title}
║  Amount:         ₱${course.price}
║  Payment Method: Credit Card
║  Mentor:         ${course.mentor}
╠══════════════════════════════════════════════════════════════╣
║  Thank you for learning with Sandiwa!
║  This is an official receipt for your records.
╚══════════════════════════════════════════════════════════════╝
`;
        const blob = new Blob([receipt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Sandiwa_Receipt_${course.id}_${new Date(course.enrolledAt).toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Receipt downloaded successfully!");
    };

    return (
        <AuthGuard>
            <SiteLayout>
                <section className="bg-cream">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-3xl font-serif font-bold">
                                {initials}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="font-serif text-3xl font-bold">{userData.userName}</h1>
                                    <Link to="/learner/profile/edit">
                                        <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-white">
                                            <Edit className="h-4 w-4 mr-1" /> Edit Profile
                                        </Button>
                                    </Link>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Learner · Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/70">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Mail className="h-4 w-4 text-gold" /> {userData.userEmail}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-gold" /> {profileData.location || "Quezon City, PH"}
                                    </span>
                                    {profileData.occupation && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Users className="h-4 w-4 text-gold" /> {profileData.occupation}
                                        </span>
                                    )}
                                </div>
                                {profileData.bio && (
                                    <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{profileData.bio}</p>
                                )}
                                
                                {/* Interests Section */}
                                {profileData.interests && profileData.interests.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 text-gold" />
                                            <h3 className="font-medium text-sm text-navy">Interests</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold">{totalCourses}</p>
                                <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold">{Math.round(totalLearningHours)}+</p>
                                <p className="text-xs text-muted-foreground">Learning Hours</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold">{completedCourses}</p>
                                <p className="text-xs text-muted-foreground">Certificates Earned</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                                <Star className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold">{averageProgress}%</p>
                                <p className="text-xs text-muted-foreground">Avg. Progress</p>
                            </div>
                        </div>
                    </div>

                    {/* MY REGISTERED EVENTS SECTION */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                                    <CalendarDays className="h-6 w-6 text-gold" />
                                    My Registered Events
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Events you've registered for ({registeredEvents.length} total)
                                </p>
                            </div>
                            <Button asChild size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                                <Link to="/learner/community/events">Browse More Events</Link>
                            </Button>
                        </div>
                        
                        {registeredEvents.length > 0 ? (
                            <>
                                <div className="mt-5 grid grid-cols-1 gap-4">
                                    {paginatedRegisteredEvents.map((event) => (
                                        <div key={event.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h3 className="font-serif text-lg font-semibold text-navy">
                                                            {event.title}
                                                        </h3>
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            isEventUpcoming(event.date) 
                                                                ? "bg-green-100 text-green-700" 
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                            {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                                                        </span>
                                                        {event.isVirtual && (
                                                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                                <Video className="h-3 w-3 inline mr-1" />
                                                                Virtual
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4 text-gold" />
                                                            {formatEventDate(new Date(event.date))}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-gold" />
                                                            {event.location}
                                                        </span>
                                                        {event.price === 0 ? (
                                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            <span className="font-semibold text-gold">₱{event.price}</span>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Registered on {new Date(event.registeredAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to="/learner/community/events/$eventId" params={{ eventId: event.id }}>
                                                        <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {event.status === "confirmed" && (
                                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                                            <CheckCircle className="h-4 w-4" />
                                                            Confirmed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {registeredEvents.length > registeredEventsPerPage && (
                                    <Pagination
                                        currentPage={registeredEventsPage}
                                        totalItems={registeredEvents.length}
                                        itemsPerPage={registeredEventsPerPage}
                                        onPageChange={setRegisteredEventsPage}
                                        showEntries={true}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="mt-5 rounded-xl border border-border bg-card p-12 text-center">
                                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-3 text-muted-foreground">You haven't registered for any events yet.</p>
                                <Button asChild className="mt-4 bg-gold hover:bg-gold/90 text-white">
                                    <Link to="/learner/community/events">Explore Events</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* EVENTS I'VE CREATED SECTION */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                                    <CalendarDays className="h-6 w-6 text-gold" />
                                    Events I've Created
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Events you've hosted ({createdEvents.length} total)
                                </p>
                            </div>
                            <Button asChild size="sm" className="bg-gold hover:bg-gold/90 text-white">
                                <Link to="/learner/community/events/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Event
                                </Link>
                            </Button>
                        </div>
                        
                        {createdEvents.length > 0 ? (
                            <>
                                <div className="mt-5 grid grid-cols-1 gap-4">
                                    {paginatedCreatedEvents.map((event) => (
                                        <div key={event.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h3 className="font-serif text-lg font-semibold text-navy">
                                                            {event.title}
                                                        </h3>
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            event.date > new Date() 
                                                                ? "bg-green-100 text-green-700" 
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                            {event.date > new Date() ? "Upcoming" : "Past"}
                                                        </span>
                                                        {event.isVirtual && (
                                                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                                <Video className="h-3 w-3 inline mr-1" />
                                                                Virtual
                                                            </span>
                                                        )}
                                                        {event.price === 0 ? (
                                                            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            <span className="font-semibold text-gold">₱{event.price}</span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4 text-gold" />
                                                            {formatEventDate(event.date, event.dateTo)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-gold" />
                                                            {event.location}
                                                        </span>
                                                        {event.capacity && (
                                                            <span className="flex items-center gap-1">
                                                                <Users className="h-4 w-4 text-gold" />
                                                                {event.registered || 0} / {event.capacity} registered
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to="/learner/community/events/$eventId" params={{ eventId: event.id }}>
                                                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    <Link to="/learner/community/events/$eventId/edit" params={{ eventId: event.id }}>
                                                        <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                                                            <Edit className="h-4 w-4 mr-1" /> Edit
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive" 
                                                        onClick={() => handleDeleteEvent(event.id, event.title)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {createdEvents.length > createdEventsPerPage && (
                                    <Pagination
                                        currentPage={createdEventsPage}
                                        totalItems={createdEvents.length}
                                        itemsPerPage={createdEventsPerPage}
                                        onPageChange={setCreatedEventsPage}
                                        showEntries={true}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="mt-5 rounded-xl border border-border bg-card p-12 text-center">
                                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-3 text-muted-foreground">You haven't created any events yet.</p>
                                <Button asChild className="mt-4 bg-gold hover:bg-gold/90 text-white">
                                    <Link to="/learner/community/events/create">Create Your First Event</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Certificates Section */}
                    {certificates.length > 0 && (
                        <div className="mt-12">
                            <h2 className="font-serif text-2xl font-bold text-navy mb-5 flex items-center gap-2">
                                <Award className="h-6 w-6 text-gold" />
                                My Certificates
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-navy text-sm line-clamp-1">{cert.courseTitle}</h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(cert.completedAt).toLocaleDateString()}</span>
                                                    <CheckCircle className="h-3 w-3 text-green-600 ml-1" />
                                                    <span className="text-green-600">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => downloadCertificate(cert)} 
                                            variant="outline" 
                                            className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                                            size="sm"
                                        >
                                            <Download className="h-4 w-4 mr-2" /> Download Certificate
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* My Courses Section */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-2xl font-bold text-navy">My Courses</h2>
                            <Button asChild size="sm" className="bg-gold hover:bg-gold/90 text-white">
                                <Link to="/learner/courses/courses">Browse More Courses</Link>
                            </Button>
                        </div>
                        
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => (
                                <div key={course.id} className="group rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 rounded-full bg-gold px-2 py-1 text-xs font-semibold text-white">
                                            {course.progress}% Complete
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs text-gold font-medium mb-1">
                                            Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                                        </p>
                                        <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2 group-hover:text-gold transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">by {course.mentor}</p>
                                        
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="text-gold font-medium">{course.progress}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${course.progress}%` }} />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.round((course.progress / 100) * 40)}h</span>
                                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.progress === 100 ? "Completed" : course.progress > 0 ? "In Progress" : "Not Started"}</span>
                                            </div>
                                            <Link to="/learner/learn/$courseId" params={{ courseId: course.id }}>
                                                <Button size="sm" className="bg-gold hover:bg-gold/90 text-white">
                                                    {course.progress === 100 ? "Review" : course.progress > 0 ? "Continue" : "Start"}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transaction History Table */}
                    {enrolledCourses.length > 0 && (
                        <div className="mt-12">
                            <h2 className="font-serif text-2xl font-bold text-navy mb-5">
                                Transaction History ({enrolledCourses.length} transactions)
                            </h2>
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Purchase Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Payment Method</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Transaction ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {paginatedCourses.map((course) => (
                                                <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-md bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                                                                {course.title.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium">{course.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                                        {new Date(course.enrolledAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gold">
                                                        ₱{course.price}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1 text-sm">
                                                            {course.price === 0 ? (
                                                                <>Free</>
                                                            ) : (
                                                                <>
                                                                    <CreditCard className="h-4 w-4 text-gold" />
                                                                    Credit Card
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            #TXN-{course.id.toUpperCase().slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {course.price > 0 ? (
                                                            <Button
                                                                onClick={() => downloadReceipt(course)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-gold text-gold hover:bg-gold hover:text-white"
                                                            >
                                                                <Download className="h-3 w-3 mr-1" />
                                                                Receipt
                                                            </Button>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">No receipt</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {enrolledCourses.length > itemsPerPage && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={enrolledCourses.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    showEntries={true}
                                />
                            )}
                        </div>
                    )}
                </section>
            </SiteLayout>
        </AuthGuard>
    );
}