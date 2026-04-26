import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { events } from "@/data/mock";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community/events/$eventId")({
  loader: ({ params }) => {
    const event = events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.event.title ?? "Event"} — Sandiwa` },
      { name: "description", content: loaderData?.event.description.slice(0, 150) ?? "" },
      { property: "og:title", content: loaderData?.event.title ?? "Event" },
      { property: "og:description", content: loaderData?.event.description.slice(0, 150) ?? "" },
      ...(loaderData?.event.image ? [{ property: "og:image", content: loaderData.event.image }] : []),
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Event not found</h1>
        <Link to="/community" className="mt-4 inline-block text-gold hover:underline">Back to community</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout><div className="mx-auto max-w-2xl py-24 text-center">{error.message}</div></SiteLayout>
  ),
  component: EventDetail,
});

function EventDetail() {
  const { event } = Route.useLoaderData();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/community" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-8 rounded-xl overflow-hidden border border-border">
          <img src={event.image} alt={event.title} width={1280} height={704} className="w-full object-cover" />
        </div>
        <h1 className="mt-10 font-serif text-4xl sm:text-5xl font-bold text-navy">{event.title}</h1>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {event.date}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</span>
        </div>
        <p className="mt-8 text-foreground/80 leading-relaxed">{event.description}</p>
        <Button size="lg" className="mt-8 bg-gold hover:bg-gold/90 text-gold-foreground">Register for Event</Button>
      </div>
    </SiteLayout>
  );
}
