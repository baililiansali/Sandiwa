import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { events as mockEvents, formatEventDate, Event } from "@/data/mockEvents";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Video, ArrowLeft, Share2, CheckCircle, Award, Edit } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { useEventRegistration } from "@/hooks/useEventRegistration";

// Helper function to get all events (mock + saved)
function getAllEvents(): Event[] {
  const savedEvents: Event[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
  
  // Convert date strings back to Date objects
  const parsedSavedEvents = savedEvents.map(event => ({
    ...event,
    date: new Date(event.date),
    dateTo: event.dateTo ? new Date(event.dateTo) : undefined
  }));
  
  const allEvents = [...mockEvents, ...parsedSavedEvents];
  // Remove duplicates by id
  return Array.from(new Map(allEvents.map(e => [e.id, e])).values());
}

export const Route = createFileRoute("/learner/community/events/$eventId")({
  component: EventDetailPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Event not found</h1>
        <Link to="/learner/community/events" className="mt-4 inline-block text-gold hover:underline">
          Back to events
        </Link>
      </div>
    </SiteLayout>
  ),
});

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { isRegistered: checkRegistration } = useEventRegistration();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEventCreator, setIsEventCreator] = useState(false);

  // Get current user info
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";
  const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "learner";

  // Load event client-side
  useEffect(() => {
    const loadEvent = () => {
      const allEvents = getAllEvents();
      const foundEvent = allEvents.find((e) => e.id === eventId);
      setEvent(foundEvent || null);
      
      // Check if current user is the creator
      if (foundEvent && foundEvent.mentorId === userId) {
        setIsEventCreator(true);
      }
      
      setLoading(false);
    };
    
    loadEvent();
    
    // Listen for storage changes
    window.addEventListener("storage", loadEvent);
    return () => window.removeEventListener("storage", loadEvent);
  }, [eventId, userId]);

  // Check registration status
  useEffect(() => {
    if (!event) return;
    
    const checkStatus = () => {
      const registered = checkRegistration(event.id);
      setIsRegistered(registered);
    };
    
    checkStatus();
    
    window.addEventListener("storage", checkStatus);
    return () => window.removeEventListener("storage", checkStatus);
  }, [event, checkRegistration]);

  const spotsLeft = event?.capacity ? event.capacity - (event.registered || 0) : null;
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0;

  const handleRegisterClick = () => {
    if (isSoldOut) {
      toast.error("This event is fully booked!");
      return;
    }
    if (isRegistered) {
      toast.info("You are already registered for this event!");
      return;
    }
    setShowModal(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/learner/community/events" });
    }
  };

  const handleEdit = () => {
    // Redirect to edit page based on user role
    if (userRole === "mentor") {
      navigate({ to: "/mentor/community/events/$eventId/edit", params: { eventId } });
    } else {
      navigate({ to: "/learner/community/events/$eventId/edit", params: { eventId } });
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <SiteLayout>
          <div className="bg-cream min-h-screen py-20 text-center">
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </SiteLayout>
      </AuthGuard>
    );
  }

  if (!event) {
    return (
      <AuthGuard>
        <SiteLayout>
          <div className="bg-cream min-h-screen py-20 text-center">
            <h1 className="font-serif text-3xl font-bold">Event not found</h1>
            <Link to="/learner/community/events" className="mt-4 inline-block text-gold hover:underline">
              Back to events
            </Link>
          </div>
        </SiteLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SiteLayout>
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              
              {/* Edit button - only show for event creator */}
              {isEventCreator && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              )}
            </div>

            {/* Registration Status Banner */}
            {isRegistered && (
              <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">You're registered for this event!</p>
                    <p className="text-sm text-green-700">
                      Check your email for confirmation details. We can't wait to see you there!
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </div>
            )}

            {/* Event Image */}
            {event.image && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="h-[300px] w-full object-cover"
                />
              </div>
            )}

            <div className="mt-8 grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h1 className="font-serif text-4xl font-bold text-navy sm:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {formatEventDate(event.date, event.dateTo)}
                  </span>
                  <span className="flex items-center gap-1">
                    {event.isVirtual ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {event.location}
                  </span>
                  {event.capacity && event.registered && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.registered} / {event.capacity} registered
                    </span>
                  )}
                </div>

                <div className="mt-8 prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {showSuccess && (
                  <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
                    <p className="font-medium">✓ Successfully registered!</p>
                    <p className="text-sm mt-1">
                      You'll receive a confirmation email with event details.
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gold">
                      {event.price === 0 ? "FREE" : `₱${event.price}`}
                    </p>
                    {!isRegistered && spotsLeft !== null && !isSoldOut && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left!
                      </p>
                    )}
                    {isSoldOut && (
                      <p className="mt-1 text-xs font-medium text-red-500">Sold Out</p>
                    )}
                  </div>

                  <Button
                    onClick={handleRegisterClick}
                    disabled={isRegistered || isSoldOut || isEventCreator}
                    className={`mt-6 w-full ${
                      isRegistered
                        ? "bg-green-600 hover:bg-green-600 cursor-default"
                        : isSoldOut
                        ? "bg-gray-400 cursor-not-allowed"
                        : isEventCreator
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gold hover:bg-gold/90"
                    } text-white font-semibold`}
                    size="lg"
                  >
                    {isEventCreator ? (
                      "You are the host"
                    ) : isRegistered ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Already Registered
                      </>
                    ) : isSoldOut ? (
                      "Sold Out"
                    ) : (
                      "Register for Event"
                    )}
                  </Button>

                  {isRegistered && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3 text-center border border-green-200">
                      <p className="text-sm font-medium text-green-700">
                        🎉 You're all set!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        We've sent the details to your email
                      </p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3 text-sm border-t border-border pt-5">
                    <h3 className="font-semibold text-navy">Event Details</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>📅 Date</span>
                        <span>{formatEventDate(event.date, event.dateTo)}</span>
                      </div>
                      {event.dateTo && (
                        <div className="flex justify-between">
                          <span>📅 End Date</span>
                          <span>{formatEventDate(event.dateTo)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>📍 Location</span>
                        <span className="text-right">{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex justify-between">
                          <span>👥 Capacity</span>
                          <span>{event.capacity}</span>
                        </div>
                      )}
                      {event.isVirtual && (
                        <div className="flex justify-between">
                          <span>💻 Platform</span>
                          <span>Zoom</span>
                        </div>
                      )}
                      {event.mentorName && (
                        <div className="flex justify-between">
                          <span>👨‍🏫 Hosted by</span>
                          <span>{event.mentorName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.description,
                          url: window.location.href,
                        }).catch(() => toast.info("Share this event with friends!"));
                      } else {
                        toast.info("Share this event with friends!");
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EventRegistrationModal
          event={event}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </SiteLayout>
    </AuthGuard>
  );
}