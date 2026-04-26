import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mock";
import { Award, BookOpen, Calendar, Mail, MapPin, Settings } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Sandiwa" },
      { name: "description", content: "Manage your Sandiwa profile, enrolled courses, and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const enrolled = courses.slice(0, 2);

  return (
    <SiteLayout>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-3xl font-serif font-bold">
              JR
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold">Juan Reyes</h1>
              <p className="text-sm text-muted-foreground mt-1">Learner · Member since April 2026</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/70">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-gold" /> juan@example.com</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" /> Quezon City, PH</span>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Edit profile
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: "Enrolled courses", value: "2" },
            { icon: Award, label: "Certificates", value: "1" },
            { icon: Calendar, label: "Upcoming events", value: "1" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-serif text-2xl font-bold">My Courses</h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {enrolled.map((c) => (
            <Link
              key={c.id}
              to="/courses/$courseId"
              params={{ courseId: c.id }}
              className="group rounded-xl border border-border overflow-hidden hover:shadow-md transition"
            >
              <img src={c.image} alt={c.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs text-gold font-medium">{c.category}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold group-hover:text-gold">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">by {c.mentor}</p>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: "45%" }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">45% complete</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
