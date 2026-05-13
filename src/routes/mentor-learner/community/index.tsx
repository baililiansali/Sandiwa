import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { events } from "@/data/mockEvents";
import { discussions } from "@/data/mockDiscussions";
import { EventCard } from "@/components/EventCard";
import { DiscussionCard } from "@/components/DiscussionCard";
import { Users, MessageCircle, Calendar, Languages, MapPin, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/mentor-learner/community/")({
  head: () => ({
    meta: [
      { title: "Community — Sandiwa" },
      { name: "description", content: "Join thousands of learners and culture enthusiasts celebrating Filipino heritage." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const upcomingEvents = events
    .filter((e) => e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const recentDiscussions = [...discussions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  const stats = [
    { label: "Members", value: "10,000+", icon: Users },
    { label: "Cities", value: "20+", icon: MapPin },
    { label: "Discussions", value: "1,200+", icon: MessageCircle },
    { label: "Events Hosted", value: "200+", icon: Calendar },
  ];

const connectWays = [
  {
    title: "Join Discussions",
    description: "Connect with fellow learners in vibrant conversations about Filipino culture.",
    icon: MessageCircle,
  },
  {
    title: "Language Exchange",
    description: "Practice Tagalog and other Filipino languages with native speakers.",
    icon: Languages,
  },
  {
    title: "Cultural Workshops",
    description: "Learn traditional crafts, dances, and cooking from expert mentors.",
    icon: Calendar,
  },
  {
    title: "Community Meetups",
    description: "Attend local gatherings and celebrate Filipino heritage together.",
    icon: MapPin,
  },
];

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <section className="bg-gradient-to-br from-cream to-white py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="font-serif text-5xl font-bold text-navy sm:text-6xl">
              A Home for Culture Lovers
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Join thousands of learners, mentors, and culture enthusiasts in a welcoming space
              where Filipino heritage is celebrated and shared.
            </p>
            <div className="mt-8">
              <Link
                to="/mentor-learner/community/discussions"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-gold-foreground transition hover:bg-gold/90"
              >
                Browse Discussions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <stat.icon className="h-6 w-6 text-gold" />
                </div>
                <p className="mt-3 font-serif text-3xl font-bold text-navy">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">What You'll Find</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Ways to Connect</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {connectWays.map((way) => (
                <div
                  key={way.title}
                  className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                    <way.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{way.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{way.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">Join Us</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Upcoming Events</h2>
            </div>
            <Link
              to="/mentor-learner/community/events"
              className="hidden text-sm font-medium text-gold hover:underline sm:flex items-center gap-1"
            >
              View all events <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>

          <div className="mt-4 text-center sm:hidden">
            <Link to="/mentor-learner/community/events" className="text-sm font-medium text-gold hover:underline">
              View all events →
            </Link>
          </div>
        </section>

        <section className="bg-cream/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gold">Join the Conversation</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Latest Discussions</h2>
              </div>
              <Link
                to="/mentor-learner/community/discussions"
                className="hidden text-sm font-medium text-gold hover:underline sm:flex items-center gap-1"
              >
                Browse all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5">
              {recentDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link to="/mentor-learner/community/discussions" className="text-sm font-medium text-gold hover:underline">
                Browse all discussions →
              </Link>
            </div>
          </div>
        </section>

      </MentorDashboardLayout>
    </AuthGuard>
  );
}