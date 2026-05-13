import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { events as mockEvents, Event } from "@/data/mockEvents";
import { EventCard } from "@/components/EventCard";
import { Calendar, Filter, Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mentor-learner/community/events/")({
  head: () => ({
    meta: [
      { title: "Events — Sandiwa" },
      { name: "description", content: "Join workshops, meetups, and cultural celebrations." },
    ],
  }),
  component: EventsListPage,
});

function EventsListPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "free" | "virtual">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>(mockEvents);

  useEffect(() => {
    const loadEvents = () => {
      const savedEvents: Event[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
      
      // Convert date strings back to Date objects
      const parsedSavedEvents = savedEvents.map(event => ({
        ...event,
        date: new Date(event.date),
        dateTo: event.dateTo ? new Date(event.dateTo) : undefined
      }));
      
      if (parsedSavedEvents.length > 0) {
        const allEventIds = new Set(mockEvents.map(e => e.id));
        const newEvents = parsedSavedEvents.filter((e: Event) => !allEventIds.has(e.id));
        setEvents([...mockEvents, ...newEvents]);
      } else {
        setEvents(mockEvents);
      }
    };
    
    loadEvents();
    window.addEventListener("storage", loadEvents);
    return () => window.removeEventListener("storage", loadEvents);
  }, []);

  const now = new Date();
  let filteredEvents = [...events];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
    );
  }

  if (filter === "upcoming") {
    filteredEvents = filteredEvents.filter((e) => e.date > now);
  } else if (filter === "free") {
    filteredEvents = filteredEvents.filter((e) => e.price === 0);
  } else if (filter === "virtual") {
    filteredEvents = filteredEvents.filter((e) => e.isVirtual === true);
  }

  filteredEvents = filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <section className="bg-gradient-to-br from-cream to-white py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">Join Us</p>
            <h1 className="mt-2 font-serif text-5xl font-bold text-navy sm:text-6xl">
              Community Events
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join workshops, meetups, and cultural celebrations with fellow culture enthusiasts.
            </p>
            
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="free">Free Events</option>
                <option value="virtual">Virtual Events</option>
                <option value="all">All Events</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
              </p>
              <Link to="/mentor-learner/community/events/create">
                <Button className="bg-gold hover:bg-gold/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Link key={event.id} to="/mentor-learner/community/events/$eventId" params={{ eventId: event.id }}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="py-20 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No events match your search or filter.</p>
              <Link to="/mentor-learner/community/events/create">
                <Button className="mt-4 bg-gold hover:bg-gold/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("upcoming");
                }}
                className="mt-4 text-sm text-gold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}