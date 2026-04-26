import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Sandiwa" },
      { name: "description", content: "Sign up for Sandiwa and join the Filipino culture learning community." },
    ],
  }),
  component: Register,
});

function Register() {
  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState({ email: "", password: "", confirm: "", firstName: "", lastName: "", role: "learner", interests: [] as string[] });
  const navigate = useNavigate();

  const interests = ["Filipino Language", "History", "Arts & Crafts", "Music & Dance", "Cuisine", "Heritage"];
  const toggleInterest = (i: string) =>
    setData((d) => ({ ...d, interests: d.interests.includes(i) ? d.interests.filter((x) => x !== i) : [...d.interests, i] }));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Logo />
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        <div className="flex justify-center"><Logo /></div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${step >= n ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              {i < 2 && <div className={`h-0.5 w-12 ${step > n ? "bg-gold" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="mt-10 text-center font-serif text-3xl font-bold">Account</h1>
            <p className="mt-1 text-center text-sm">Create your account</p>
            <form className="mt-8 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="mt-1.5 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <input required type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="mt-1.5 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <input required type={showPwd ? "text" : "password"} value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="••••••••" className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="mt-1.5 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <input required type={showConfirm ? "text" : "password"} value={data.confirm} onChange={(e) => setData({ ...data, confirm: e.target.value })} placeholder="••••••••" className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-gold font-medium hover:underline">Log in</Link>
              </p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="mt-10 text-center font-serif text-3xl font-bold">Profile</h1>
            <p className="mt-1 text-center text-sm">Tell us about yourself</p>
            <form className="mt-8 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input required value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input required value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">I want to join as</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[{ k: "learner", l: "Learner" }, { k: "mentor", l: "Mentor" }].map((r) => (
                    <button type="button" key={r.k} onClick={() => setData({ ...data, role: r.k })} className={`rounded-md border px-4 py-3 text-sm ${data.role === r.k ? "border-gold bg-gold/10 text-gold font-semibold" : "border-border"}`}>
                      {r.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" size="lg" className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="mt-10 text-center font-serif text-3xl font-bold">Interests</h1>
            <p className="mt-1 text-center text-sm">Pick what you love</p>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {interests.map((i) => (
                <button key={i} type="button" onClick={() => toggleInterest(i)} className={`rounded-full border px-4 py-2 text-sm ${data.interests.includes(i) ? "border-gold bg-gold text-gold-foreground" : "border-border"}`}>
                  {i}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button type="button" size="lg" className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground" onClick={() => navigate({ to: "/" })}>
                Create Account
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
