import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { Edit, Mail, MapPin, Award, BookOpen, Users, Star, Clock, Calendar, Globe, Linkedin, Twitter, GraduationCap, BadgeCheck, CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { courses } from "@/data/mockCourses";
import { Event, formatEventDate } from "@/data/mockEvents";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor/profile/")({
  head: () => ({
    meta: [
      { title: "Mentor Profile — Sandiwa" },
      { name: "description", content: "Your mentor profile and public presence." },
    ],
  }),
  component: MentorProfilePage,
});

interface MentorCourse {
  id: string;
  title: string;
  image: string;
  price: number;
  studentsCount: number;
  averageRating: number;
  publishedAt: string;
  isPublished: boolean;
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

function MentorProfilePage() {
  const [mentorCourses, setMentorCourses] = useState<MentorCourse[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [profileData, setProfileData] = useState({
    phone: "",
    location: "",
    bio: "",
    occupation: "",
    credentials: [] as string[],
    skills: [] as string[],
    interests: [] as string[],
    socialLinks: {
      twitter: "",
      linkedin: "",
      website: "",
    },
  });
  
  const [userData, setUserData] = useState({
    userName: "Jose Reyes",
    userEmail: "mentor.jose@gmail.com",
  });

  // Pagination state for courses
  const [coursesPage, setCoursesPage] = useState(1);
  const coursesPerPage = 3;
  
  // Pagination state for events
  const [eventsPage, setEventsPage] = useState(1);
  const eventsPerPage = 3;

  useEffect(() => {
    const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Jose Reyes";
    const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "mentor.jose@gmail.com";
    const mentorId = localStorage.getItem("mentorId") || sessionStorage.getItem("mentorId") || "";
    setUserData({ userName, userEmail });
    
    // Load from mentorProfile
    const profile = JSON.parse(localStorage.getItem("sandiwa.mentorProfile") || "{}");
    
    setProfileData({
      phone: profile.phone || "",
      location: profile.location || "Manila, Philippines",
      bio: profile.bio || "Passionate historian with over 15 years of experience studying and teaching Philippine history.",
      occupation: profile.occupation || "History Professor & Heritage Consultant",
      credentials: profile.credentials || [
        "PhD in Philippine History - University of Santo Tomas",
        "MA in Southeast Asian Studies - Ateneo de Manila University",
        "Certified Heritage Documentation Specialist"
      ],
      skills: profile.skills || [
        "Philippine Historiography",
        "Archival Research",
        "Oral History Documentation",
        "Curriculum Development",
        "Public Speaking",
        "Heritage Conservation"
      ],
      interests: profile.interests || ["History", "Heritage", "Literature"],
      socialLinks: profile.socialLinks || {
        twitter: "",
        linkedin: "",
        website: "",
      },
    });
    
    // Filter courses for the current mentor
    const mentorCoursesData = courses.filter(course => course.mentor === userName);
    const formattedCourses: MentorCourse[] = mentorCoursesData.map(course => ({
      id: course.id,
      title: course.title,
      image: course.image,
      price: course.price,
      studentsCount: course.enrolled,
      averageRating: course.rating,
      publishedAt: course.createdAt,
      isPublished: true,
    }));
    setMentorCourses(formattedCourses);
    
    // Load events created by this mentor
    loadCreatedEvents(mentorId);
  }, []);

  const loadCreatedEvents = (mentorId: string) => {
    const storedEvents: StoredEvent[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
    
    const parsedEvents: Event[] = storedEvents.map(event => ({
      ...event,
      date: new Date(event.date),
      dateTo: event.dateTo ? new Date(event.dateTo) : undefined,
      category: event.category as "workshop" | "meetup" | "celebration" | "conversation"
    }));
    
    const mentorEvents = parsedEvents.filter(event => event.mentorId === mentorId);
    setCreatedEvents(mentorEvents);
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      const storedEvents: StoredEvent[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
      const filteredEvents = storedEvents.filter(e => e.id !== eventId);
      localStorage.setItem("sandiwa.events", JSON.stringify(filteredEvents));
      
      const mentorId = localStorage.getItem("mentorId") || sessionStorage.getItem("mentorId") || "";
      loadCreatedEvents(mentorId);
      
      toast.success("Event deleted successfully!");
    }
  };

  const initials = userData.userName.split(" ").map(n => n[0]).join("").toUpperCase();
  
  const totalStudents = mentorCourses.reduce((sum, course) => sum + course.studentsCount, 0);
  const totalCourses = mentorCourses.length;
  const averageRating = mentorCourses.length > 0 
    ? (mentorCourses.reduce((sum, course) => sum + course.averageRating, 0) / mentorCourses.length).toFixed(1)
    : "0";
  const totalEarnings = mentorCourses.reduce((sum, course) => sum + (course.price * course.studentsCount), 0);

  // Pagination
  const coursesStartIndex = (coursesPage - 1) * coursesPerPage;
  const paginatedCourses = mentorCourses.slice(coursesStartIndex, coursesStartIndex + coursesPerPage);
  
  const eventsStartIndex = (eventsPage - 1) * eventsPerPage;
  const paginatedEvents = createdEvents.slice(eventsStartIndex, eventsStartIndex + eventsPerPage);

  const isEventUpcoming = (eventDate: Date) => {
    return eventDate > new Date();
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-3xl font-serif font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-serif text-3xl font-bold text-navy">{userData.userName}</h1>
                  <Link to="/mentor/profile/edit">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-white">
                      <Edit className="h-4 w-4 mr-1" /> Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-gold font-medium mt-1">{profileData.occupation}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mentor · Member since 2024
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-gold" /> {userData.userEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" /> {profileData.location}
                  </span>
                  {profileData.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gold" /> {profileData.phone}
                    </span>
                  )}
                </div>
                {profileData.bio && (
                  <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-border bg-white p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-navy">{totalStudents.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-navy">{totalCourses}</p>
                <p className="text-xs text-muted-foreground">Courses Published</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-navy">{averageRating}</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-navy">₱{Math.round(totalEarnings / 1000)}K+</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Credentials Section */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  <h2 className="font-serif text-xl font-bold text-navy">Credentials</h2>
                </div>
                {profileData.credentials.length > 0 ? (
                  <ul className="space-y-3">
                    {profileData.credentials.map((credential, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <BadgeCheck className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{credential}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No credentials added yet.</p>
                )}
              </div>

              {/* Skills Section */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-gold" />
                  <h2 className="font-serif text-xl font-bold text-navy">Skills & Expertise</h2>
                </div>
                {profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
              </div>

              {/* Interests Section */}
              {profileData.interests.length > 0 && (
                <div className="rounded-xl border border-border bg-white p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-gold" />
                    <h2 className="font-serif text-xl font-bold text-navy">Interests</h2>
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

              {/* Contact & Social Section */}
              <div className="rounded-xl border border-border bg-white p-6">
                <h2 className="font-serif text-xl font-bold text-navy mb-4">Connect</h2>
                <div className="space-y-3">
                  {profileData.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-gold" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gold" />
                    <span>{userData.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gold" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
                
                {(profileData.socialLinks.twitter || profileData.socialLinks.linkedin || profileData.socialLinks.website) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex gap-4">
                      {profileData.socialLinks.twitter && (
                        <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/70 transition">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {profileData.socialLinks.linkedin && (
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/70 transition">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {profileData.socialLinks.website && (
                        <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/70 transition">
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Events I've Created Section */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-gold" />
                      <h2 className="font-serif text-xl font-bold text-navy">Events I've Created</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {createdEvents.length} event{createdEvents.length !== 1 ? "s" : ""} hosted
                    </p>
                  </div>
                  <Link to="/mentor/community/events/create">
                    <Button className="bg-gold hover:bg-gold/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                  </Link>
                </div>

                {createdEvents.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {paginatedEvents.map((event) => (
                        <div key={event.id} className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row">
                            {event.image && (
                              <div className="sm:w-32 h-32 bg-muted overflow-hidden">
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between flex-wrap gap-2">
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-navy line-clamp-1">
                                    {event.title}
                                  </h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-gold" />
                                      {formatEventDate(event.date, event.dateTo)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-gold" />
                                      {event.location}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                      isEventUpcoming(event.date) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                    }`}>
                                      {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Link to="/mentor/community/events/$eventId" params={{ eventId: event.id }}>
                                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                                      View Details
                                    </Button>
                                  </Link>
                                  <Link to="/mentor/community/events/$eventId/edit" params={{ eventId: event.id }}>
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
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {event.capacity && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {event.registered || 0} / {event.capacity} registered
                                    </span>
                                  )}
                                  <span className="font-semibold text-gold">
                                    {event.price === 0 ? "Free" : `₱${event.price}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {createdEvents.length > eventsPerPage && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={eventsPage}
                          totalItems={createdEvents.length}
                          itemsPerPage={eventsPerPage}
                          onPageChange={setEventsPage}
                          showEntries={true}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-3 text-muted-foreground">You haven't created any events yet.</p>
                    <Link to="/mentor/community/events/create">
                      <Button className="mt-4 bg-gold hover:bg-gold/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Event
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Courses by Mentor Section */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-gold" />
                      <h2 className="font-serif text-xl font-bold text-navy">Courses by {userData.userName.split(" ")[0]}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalCourses} course{totalCourses !== 1 ? "s" : ""} published
                    </p>
                  </div>
                </div>

                {mentorCourses.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {paginatedCourses.map((course) => (
                        <div key={course.id} className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-32 h-32 bg-muted overflow-hidden">
                              <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between flex-wrap gap-2">
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-navy line-clamp-1">
                                    {course.title}
                                  </h3>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3.5 w-3.5 text-gold" />
                                      {course.studentsCount.toLocaleString()} students
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 text-gold" />
                                      {course.averageRating} ★
                                    </span>
                                    <span className="text-gold font-semibold">
                                      ₱{course.price}
                                    </span>
                                  </div>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  course.isPublished 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {course.isPublished ? "Published" : "Draft"}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>Published {new Date(course.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Link 
                                    to="/mentor/courses/edit/$courseId" 
                                    params={{ courseId: course.id }}
                                  >
                                    <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                                      Edit
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {mentorCourses.length > coursesPerPage && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={coursesPage}
                          totalItems={mentorCourses.length}
                          itemsPerPage={coursesPerPage}
                          onPageChange={setCoursesPage}
                          showEntries={true}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-3 text-muted-foreground">You haven't created any courses yet.</p>
                    <Link to="/mentor/courses/create">
                      <Button className="mt-4 bg-gold hover:bg-gold/90 text-white">
                        Create Your First Course
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}