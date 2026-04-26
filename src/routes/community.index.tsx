import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { events } from "@/data/mock";
import { MessageCircle, Calendar, Users, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community — Sandiwa" },
      { name: "description", content: "A home for culture lovers. Join thousands of learners, mentors, and culture enthusiasts." },
      { property: "og:title", content: "Sandiwa Community — A Home for Culture Lovers" },
      { property: "og:description", content: "Join discussions, attend events, and connect with the Sandiwa community." },
    ],
  }),
  component: Community,
});

const stats = [
  { value: "10,000+", label: "Members" },
  { value: "20+", label: "Cities" },
  { value: "1,200+", label: "Discussions" },
  { value: "200+", label: "Events Hosted" },
];

const features = [
  { icon: MessageCircle, title: "Discussions", desc: "Ask questions and share insights with fellow learners." },
  { icon: Calendar, title: "Events", desc: "Join workshops, meetups, and cultural celebrations." },
  { icon: Users, title: "Mentorship", desc: "Connect with passionate mentors for guidance." },
  { icon: Sparkles, title: "Culture Stories", desc: "Discover the stories behind Filipino heritage." },
];

function Community() {
  return (
    <SiteLayout>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Sandiwa Community</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl font-bold text-navy leading-tight">
            A Home for<br /> Culture Lovers
          </h1>
          <p className="mt-5 text-muted-foreground">
            Join thousands of learners, mentors, and culture enthusiasts in a welcoming space where Filipino heritage is celebrated and shared.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link to="/community/discussions">Browse Discussions</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-navy">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">What You'll Find</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy">Ways to Connect</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl font-bold text-navy">Upcoming Events</h2>
            <Link to="/community/discussions" className="text-sm text-gold inline-flex items-center gap-1 hover:underline">
              View discussions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <Link
                key={e.id}
                to="/community/events/$eventId"
                params={{ eventId: e.id }}
                className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={e.image} alt={e.title} loading="lazy" width={1280} height={704} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-semibold text-navy">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.date} • {e.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
