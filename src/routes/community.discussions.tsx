import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { discussions } from "@/data/mock";
import { Search, Filter, MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/community/discussions")({
  head: () => ({
    meta: [
      { title: "Browse Discussions — Sandiwa Community" },
      { name: "description", content: "Jump into conversations happening across the Sandiwa community." },
      { property: "og:title", content: "Browse Discussions — Sandiwa" },
      { property: "og:description", content: "Latest discussions in the Sandiwa community." },
    ],
  }),
  component: DiscussionsPage,
});

function DiscussionsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = ["all", ...Array.from(new Set(discussions.map((d) => d.category)))];
  const filtered = discussions.filter((d) =>
    (cat === "all" || d.category === cat) &&
    (d.title.toLowerCase().includes(q.toLowerCase()) || d.body.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SiteLayout>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Latest Discussions</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-navy">Browse Discussions</h1>
          <p className="mt-4 text-muted-foreground">Jump into conversations happening across the community.</p>
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search discussions"
              className="w-full rounded-full bg-background border border-border pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 pb-2">
          <div className="relative">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="appearance-none rounded-md border border-border bg-background pl-9 pr-8 py-2 text-sm">
              {cats.map((c) => <option key={c} value={c}>{c === "all" ? "Filter" : c}</option>)}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} discussions found</p>
        <div className="mt-4 space-y-4">
          {filtered.map((d) => (
            <article key={d.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-gold px-3 py-1 font-medium text-gold-foreground">{d.category}</span>
                <span className="text-muted-foreground">by {d.author} · {d.hoursAgo} hours ago</span>
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold text-navy">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
              <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> {d.replies} replies</span>
                <span className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /> {d.likes} likes</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
