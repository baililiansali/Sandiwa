import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { mentors, courses } from "@/data/mock";
import { ArrowLeft, Star, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mentors/$mentorId")({
  loader: ({ params }) => {
    const mentor = mentors.find((m) => m.id === params.mentorId);
    if (!mentor) throw notFound();
    return { mentor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.mentor.name ?? "Mentor"} — Sandiwa` },
      { name: "description", content: loaderData?.mentor.bio ?? "" },
      { property: "og:title", content: loaderData?.mentor.name ?? "Mentor" },
      { property: "og:description", content: loaderData?.mentor.bio ?? "" },
      ...(loaderData?.mentor.image ? [{ property: "og:image", content: loaderData.mentor.image }] : []),
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Mentor not found</h1>
        <Link to="/mentors" className="mt-4 inline-block text-gold hover:underline">Back to mentors</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">{error.message}</div>
    </SiteLayout>
  ),
  component: MentorDetail,
});

function MentorDetail() {
  const { mentor } = Route.useLoaderData();
  const mentorCourses = courses.filter((c) => c.mentorId === mentor.id);

  return (
    <SiteLayout>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/mentors" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to mentors
          </Link>
          <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] items-start">
            <img src={mentor.image} alt={mentor.name} width={280} height={280} className="rounded-xl object-cover w-full max-w-[280px] aspect-square" />
            <div>
              <h1 className="font-serif text-4xl font-bold text-navy">{mentor.name}</h1>
              <p className="mt-1 text-gold font-medium">{mentor.title}</p>
              <p className="mt-5 text-muted-foreground">{mentor.bio}</p>
              <div className="mt-6 flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /> {mentor.rating}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {mentor.students} students</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {mentor.courses} courses</span>
              </div>
              <Button className="mt-6 bg-gold hover:bg-gold/90 text-gold-foreground">Follow Mentor</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-2xl font-semibold text-navy">Courses</h2>
        {mentorCourses.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No courses yet from this mentor.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentorCourses.map((c) => (
              <Link
                key={c.id}
                to="/courses/$courseId"
                params={{ courseId: c.id }}
                className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
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
        )}
      </section>
    </SiteLayout>
  );
}
