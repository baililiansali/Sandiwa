import { Link } from "@tanstack/react-router";
import { Bell, ShoppingCart, UserCircle2, Menu } from "lucide-react";
import { Logo } from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/courses" as const, label: "Courses" },
  { to: "/mentors" as const, label: "Mentors" },
  { to: "/community" as const, label: "Community" },
];

export function Header() {
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
                <Logo />
                <nav className="mt-4 flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="rounded-md px-3 py-2 text-base hover:bg-accent"
                    >
                      {l.label}
                    </Link>
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
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
                activeProps={{ className: "text-gold font-semibold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button aria-label="Notifications" className="p-2 text-foreground/70 hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="p-2 text-foreground/70 hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <Link to="/login" aria-label="Account" className="p-2 text-foreground/70 hover:text-foreground hidden sm:inline-flex">
            <UserCircle2 className="h-6 w-6" />
          </Link>
          <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-foreground/80 hover:text-gold">
            Log in
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
