import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Video, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/data/mockEvents";

interface MentorEventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    isVirtual?: boolean;
    price?: number;
    capacity?: number;
    registered?: number;
    image?: string;
    category: string;
    mentorId?: string;
  };
  compact?: boolean;
}

export function MentorEventCard({ event, compact = false }: MentorEventCardProps) {
  const spotsLeft = event.capacity ? event.capacity - (event.registered || 0) : null;
  const isUpcoming = event.date > new Date();

  if (compact) {
    return (
      <Link
        to="/mentor/community/events/$eventId"
        params={{ eventId: event.id }}
        className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-navy group-hover:text-gold transition">
              {event.title}
            </h3>
            {event.isVirtual && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                <Video className="h-3 w-3 inline mr-1" />
                Virtual
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
            {event.price === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span className="text-gold font-semibold">₱{event.price}</span>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
          Manage
        </Button>
      </Link>
    );
  }

  return (
    <Link
      to="/mentor/community/events/$eventId"
      params={{ eventId: event.id }}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
    >
      {event.image && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!isUpcoming && (
            <span className="absolute top-3 right-3 rounded-full bg-gray-900/80 px-2 py-1 text-xs text-white">
              Past Event
            </span>
          )}
          {isUpcoming && spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
            <span className="absolute top-3 right-3 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
              Only {spotsLeft} left!
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {event.isVirtual && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              <Video className="h-3 w-3 inline mr-1" />
              Virtual
            </span>
          )}
          {event.price === 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Free
            </span>
          )}
        </div>
        <h3 className="font-serif text-xl font-semibold text-navy group-hover:text-gold transition line-clamp-2">
          {event.title}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            <span>{event.location}</span>
          </div>
          {event.capacity && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              <span>{event.registered || 0} / {event.capacity} registered</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <span className="font-serif text-lg font-bold text-gold">
            {event.price === 0 ? "FREE" : `₱${event.price}`}
          </span>
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-white">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
}