import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const sections = [
  {
    title: "Courses",
    links: ["Filipino Language", "History", "Arts & Crafts", "Music & Dance", "Cuisine"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Blogs", "Vlogs", "Partners"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "FAQ", "Community", "Resources"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Connecting hearts through Filipino language and culture. Anyone can teach, anyone can learn.
            </p>
            <div className="mt-5 flex items-center gap-3 text-gold">
              <a href="#" aria-label="Facebook" className="hover:opacity-70"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" className="hover:opacity-70"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:opacity-70"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-70"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title} className="md:col-span-2">
              <h4 className="font-serif text-base font-semibold text-foreground">{s.title}</h4>
              <ul className="mt-4 space-y-3">
                {s.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          ©2026 Sandiwa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
