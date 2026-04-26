import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { mentors } from "@/data/mock";
import { Search, Filter, Star, Users, BookOpen } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/mentors/")({
  head: () => ({
    meta: [
      { title: "Meet The Mentors — Sandiwa" },
      { name: "description", content: "Our mentors are culture enthusiasts passionate about sharing Filipino heritage with the world." },
      { property: "og:title", content: "Meet The Mentors — Sandiwa" },
      { property: "og:description", content: "Discover passionate Filipino culture mentors." },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  const [q, setQ] = useState("");
  const filtered = mentors.filter((m) =>
    m.name.toLowerCase().includes(q.toLowerCase()) || m.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <SiteLayout>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Our Mentors</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-navy">Meet The Mentors</h1>
          <p className="mt-4 text-muted-foreground">
            Our mentors are culture enthusiasts passionate about sharing Filipino heritage with the world.
          </p>
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search mentors"
              className="w-full rounded-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 pb-4">
          <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} mentors found</p>
        <div className="mt-6 space-y-4">
          {filtered.map((m) => (
            <Link
              key={m.id}
              to="/mentors/$mentorId"
              params={{ mentorId: m.id }}
              className="flex flex-col sm:flex-row gap-5 rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow"
            >
              <img src={m.image} alt={m.name} loading="lazy" width={140} height={140} className="h-32 w-32 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl font-semibold text-navy">{m.name}</h3>
                <p className="text-sm text-gold">{m.title}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.bio}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {m.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {m.students} students</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {m.courses} courses</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
