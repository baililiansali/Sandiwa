import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star, Users, BookOpen, ArrowRightLeft } from "lucide-react";
import { courses, mentors } from "@/data/mock";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sandiwa — Discover the Heart of Filipino Culture" },
      {
        name: "description",
        content:
          "Learn Filipino language and culture from passionate mentors. Anyone can teach, anyone can learn.",
      },
      { property: "og:title", content: "Sandiwa — Discover the Heart of Filipino Culture" },
      {
        property: "og:description",
        content:
          "Learn Filipino language and culture from passionate mentors. Join our community.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <FeaturedCourses />
      <FeaturedMentors />
      <Translator />
      <CallToAction />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span>Trusted by 10,000+ learners</span>
        </div>
        <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-navy">
          Discover the Heart of
          <br />
          <span className="text-gold">Filipino Culture</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Learn Filipino language and culture from passionate mentors. Anyone can teach,
          anyone can learn. Join our growing community of culture enthusiasts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link to="/courses">
              Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border">
            <Link to="/community">
              <Heart className="mr-2 h-4 w-4" /> Join Community
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "500+", label: "Expert Courses" },
    { value: "50K+", label: "Active Learners" },
    { value: "98%", label: "Satisfaction Rate" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
      <div className="grid grid-cols-3 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-navy">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedCourses() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">Featured Courses</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy">
          Start Your Learning Journey
        </h2>
        <p className="mt-4 text-muted-foreground">
          Explore our most popular courses on Filipino language, history, and culture curated by our community mentors.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline">
          View All Courses <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

import type { Course } from "@/data/mock";
function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {course.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
            {course.badge}
          </span>
        )}
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-navy line-clamp-2">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">by {course.mentor}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrolled.toLocaleString()}</span>
          <span>{course.hours}h</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-serif text-lg font-semibold text-gold">₱{course.price}</span>
          <span className="text-sm text-gold inline-flex items-center gap-1">Learn More <ArrowRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedMentors() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Meet the Mentors</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy">Learn From The Best</h2>
          <p className="mt-4 text-muted-foreground">
            Our mentors are culture enthusiasts passionate about sharing Filipino heritage with the world.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {mentors.slice(0, 2).map((m) => (
            <Link
              key={m.id}
              to="/mentors/$mentorId"
              params={{ mentorId: m.id }}
              className="flex gap-4 rounded-xl bg-card border border-border p-5 hover:shadow-lg transition-shadow"
            >
              <img src={m.image} alt={m.name} loading="lazy" width={120} height={120} className="h-24 w-24 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold text-navy">{m.name}</h3>
                <p className="text-xs text-gold">{m.title}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.bio}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {m.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.students}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {m.courses} courses</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/mentors" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline">
            View All Mentors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const dictionary: Record<string, Record<string, string>> = {
  fil: {
    hello: "kamusta",
    "thank you": "salamat",
    "good morning": "magandang umaga",
    friend: "kaibigan",
    love: "pag-ibig",
    family: "pamilya",
    food: "pagkain",
    water: "tubig",
  },
  ceb: {
    hello: "kumusta",
    "thank you": "salamat",
    "good morning": "maayong buntag",
    friend: "higala",
    love: "gugma",
    family: "pamilya",
    food: "pagkaon",
    water: "tubig",
  },
  ilo: {
    hello: "kumusta",
    "thank you": "agyamanak",
    "good morning": "naimbag a bigat",
    friend: "gayyem",
    love: "ayat",
    family: "pamilia",
    food: "kanen",
    water: "danum",
  },
};

function Translator() {
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("fil");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const translate = () => {
    const text = input.trim().toLowerCase();
    if (!text) return setOutput("");
    if (to === "en") {
      const dict = dictionary[from];
      if (!dict) return setOutput(input);
      const reverse = Object.entries(dict).find(([, v]) => v === text);
      setOutput(reverse ? reverse[0] : `[${input}]`);
      return;
    }
    const dict = dictionary[to];
    setOutput(dict?.[text] ?? `[${input}]`);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setInput(output);
    setOutput(input);
  };

  const langs = [
    { code: "en", label: "English" },
    { code: "fil", label: "Filipino (Tagalog)" },
    { code: "ceb", label: "Cebuano" },
    { code: "ilo", label: "Ilocano" },
  ];

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">Easy Translation</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-navy">Language Translator</h2>
        <p className="mt-3 text-muted-foreground">Translate different Philippine languages instantly.</p>

        <div className="mt-8 rounded-xl bg-background border border-border p-5 sm:p-6 text-left">
          <div className="flex items-center gap-3">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm">
              {langs.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button onClick={swap} aria-label="Swap" className="p-2 rounded-md hover:bg-accent text-gold">
              <ArrowRightLeft className="h-5 w-5" />
            </button>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm">
              {langs.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try: hello, thank you, friend..."
              className="min-h-[120px] rounded-md border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <textarea
              value={output}
              readOnly
              placeholder="Translation"
              className="min-h-[120px] rounded-md border border-border bg-muted p-3 text-sm resize-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={translate} className="bg-gold hover:bg-gold/90 text-gold-foreground">Translate</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-[oklch(0.32_0.05_130)] text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="inline-block rounded-full border border-white/20 px-4 py-1 text-xs font-medium tracking-wider uppercase">
          Join Our Community
        </span>
        <h2 className="mt-5 font-serif text-4xl sm:text-5xl font-bold">Start Learning Today</h2>
        <p className="mt-4 text-white/80 max-w-xl mx-auto">
          Join thousands of learners exploring Filipino language and culture. Whether you want to learn or teach, Sandiwa welcomes you.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="secondary" className="bg-white text-navy hover:bg-white/90">
            <Link to="/register">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-5 text-xs text-white/60">No credit card required • Free trial available • Cancel anytime</p>
      </div>
    </section>
  );
}
