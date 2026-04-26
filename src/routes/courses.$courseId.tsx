import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { courses, mentors } from "@/data/mock";
import { ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — Sandiwa` },
      { name: "description", content: loaderData?.course.description ?? "" },
      { property: "og:title", content: loaderData?.course.title ?? "Course" },
      { property: "og:description", content: loaderData?.course.description ?? "" },
      ...(loaderData?.course.image ? [{ property: "og:image", content: loaderData.course.image }] : []),
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-gold hover:underline">Back to courses</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <p>Something went wrong: {error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const mentor = mentors.find((m) => m.id === course.mentorId);

  return (
    <SiteLayout>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 items-center">
            <div>
              {course.badge && (
                <span className="inline-block rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                  {course.badge}
                </span>
              )}
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy leading-tight">
                {course.title}
              </h1>
              <p className="mt-5 text-muted-foreground max-w-xl">{course.description}</p>
              <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.enrolled.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.hours}h</span>
              </div>
              {mentor && (
                <Link to="/mentors/$mentorId" params={{ mentorId: mentor.id }} className="mt-6 inline-flex items-center gap-3 group">
                  <img src={mentor.image} alt={mentor.name} className="h-12 w-12 rounded-full object-cover" width={48} height={48} loading="lazy" />
                  <div>
                    <p className="font-medium text-navy group-hover:text-gold">{mentor.name}</p>
                    <p className="text-xs text-gold">{mentor.title}</p>
                  </div>
                </Link>
              )}
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-xl">
              <img src={course.image} alt={course.title} className="h-full w-full object-cover" width={1280} height={720} />
              <div className="absolute inset-0 flex items-center justify-center">
                <button aria-label="Play preview" className="h-16 w-16 rounded-full bg-gold/90 hover:bg-gold text-gold-foreground flex items-center justify-center shadow-lg">
                  <Play className="h-7 w-7 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-navy">What You'll Learn</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>{o}</span>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-serif text-2xl font-semibold text-navy">Course Content</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.lessons.length} lessons • {course.hours}h total
              </p>
              <ul className="mt-5 divide-y divide-border rounded-xl border border-border bg-card">
                {course.lessons.map((l, i) => (
                  <li key={l.title} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm text-navy">{l.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{l.minutes} min</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-cream p-6">
              <p className="font-serif text-4xl font-bold text-navy">₱{course.price}</p>
              <Button className="mt-5 w-full bg-gold hover:bg-gold/90 text-gold-foreground" size="lg">
                Enroll Now
              </Button>
              <Button variant="outline" className="mt-3 w-full" size="lg">
                Add to Cart
              </Button>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground border-t border-border pt-5">
                <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> {course.hours}h of content</li>
                <li className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {course.lessons.length} lessons</li>
                <li className="flex items-center gap-2"><Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} enrolled</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
