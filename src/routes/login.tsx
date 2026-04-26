import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Sandiwa" },
      { name: "description", content: "Sign in to Sandiwa to continue learning Filipino language and culture." },
    ],
  }),
  component: Login,
});

function Login() {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Logo />
      </div>
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center font-serif text-4xl font-bold">
          Welcome to <span className="text-gold">Sandiwa</span>
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Join our community of learners and mentors exploring Filipino culture.
        </p>

        <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
              <input type="email" placeholder="Enter your email address" className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
              <input type={showPwd ? "text" : "password"} placeholder="Enter your password" className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-foreground/80">
              <input type="checkbox" className="rounded border-border accent-[oklch(0.65_0.13_65)]" /> Remember me
            </label>
            <a href="#" className="text-gold hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" size="lg" className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">Log in</Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex justify-center gap-3">
          {["G", "f", ""].map((label, i) => (
            <button key={i} aria-label="Social" className="h-12 w-14 rounded-md border border-border bg-background flex items-center justify-center text-lg font-bold hover:bg-accent">
              {i === 0 ? "G" : i === 1 ? "f" : "🍎"}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-gold font-medium hover:underline">Register here</Link>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
