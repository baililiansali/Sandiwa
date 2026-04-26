import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { courses } from "@/data/mock";
import { Search, Filter, Star, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Explore All Courses — Sandiwa" },
      { name: "description", content: "Browse our growing library of courses on Filipino language, culture, history, and more." },
      { property: "og:title", content: "Explore All Courses — Sandiwa" },
      { property: "og:description", content: "Browse Filipino language and culture courses." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = ["all", ...Array.from(new Set(courses.map((c) => c.category)))];
  const filtered = courses.filter((c) =>
    (cat === "all" || c.category === cat) &&
    (c.title.toLowerCase().includes(q.toLowerCase()) || c.mentor.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SiteLayout>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Our Courses</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-navy">Explore All Courses</h1>
          <p className="mt-4 text-muted-foreground">
            Browse our growing library of courses on Filipino language, culture, history, and more.
          </p>
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses"
              className="w-full rounded-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <div className="relative">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="appearance-none rounded-md border border-border bg-background pl-9 pr-8 py-2 text-sm">
              {cats.map((c) => <option key={c} value={c}>{c === "all" ? "Filter" : c}</option>)}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} courses found</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to="/courses/$courseId"
              params={{ courseId: c.id }}
              className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {c.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                    {c.badge}
                  </span>
                )}
                <img src={c.image} alt={c.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">by {c.mentor}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {c.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.enrolled.toLocaleString()}</span>
                  <span>{c.hours}h</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-serif text-lg font-semibold text-gold">₱{c.price}</span>
                  <span className="text-sm text-gold inline-flex items-center gap-1">Learn More <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
