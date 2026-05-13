import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

const navLinks = [
  { key: "hero", label: "Home" },
  { key: "featured-courses", label: "Courses" },
  { key: "featured-mentors", label: "Mentors" },
  { key: "community", label: "Community" },
];

export function Header() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 -ml-2" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <div className="mt-8 flex flex-col gap-4">
                <Link to="/">
                  <Logo />
                </Link>
                <nav className="mt-4 flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => scrollToSection(l.key)}
                      className="rounded-md px-3 py-2 text-left text-base hover:bg-accent"
                    >
                      {l.label}
                    </button>
                  ))}
                  <Link to="/login" className="rounded-md px-3 py-2 text-base hover:bg-accent">
                    Log in
                  </Link>
                  <Link to="/register" className="rounded-md px-3 py-2 text-base hover:bg-accent">
                    Sign up
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <button
                key={l.key}
                onClick={() => scrollToSection(l.key)}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/login"
            className="hidden md:inline-flex text-sm font-medium text-foreground/80 hover:text-gold ml-2"
          >
            Log in
          </Link>

          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-gold hover:bg-gold/90 text-gold-foreground"
          >
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}