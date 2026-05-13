import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff, Check, User, MapPin, FileText, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ 
        email: "", 
        password: "", 
        confirm: "", 
        username: "",
        firstName: "", 
        lastName: "", 
        phoneNum: "",
        location: "",
        bio: "",
        interests: [] as string[] 
    });
    const navigate = useNavigate();

    const interests = ["Filipino Language", "History", "Arts & Crafts", "Music & Dance", "Cuisine", "Heritage"];
    const toggleInterest = (i: string) =>
        setData((d) => ({ ...d, interests: d.interests.includes(i) ? d.interests.filter((x) => x !== i) : [...d.interests, i] }));

    // Validate phone number (Philippines format)
    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^(09|\+639)\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleCreateAccount = async () => {
        if (data.password !== data.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (data.phoneNum && !validatePhoneNumber(data.phoneNum)) {
            toast.error("Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)");
            return;
        }
        
        setIsLoading(true);
    
        // Simulate API call
        setTimeout(() => {
            // Store user info - default role is learner
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userName", `${data.firstName} ${data.lastName}`);
            localStorage.setItem("userInitials", `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`);
            localStorage.setItem("userRole", "learner");
            
            // Store additional profile info
            const profileData = {
                phone: data.phoneNum,
                location: data.location,
                bio: data.bio,
                username: data.username,
                interests: data.interests,
            };
            localStorage.setItem("sandiwa.profile", JSON.stringify(profileData));
            
            toast.success("Account created successfully! Redirecting to dashboard...");
            setIsLoading(false);
            navigate({ to: "/learner/profile" });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>
                <Logo />
            </div>

            <div className="mx-auto max-w-md px-4 py-6">
                <div className="mt-8 flex items-center justify-center gap-2">
                    {[1, 2, 3, 4].map((n, i) => (
                        <div key={n} className="flex items-center gap-2">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${step >= n ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"}`}>
                                {step > n ? <Check className="h-4 w-4" /> : n}
                            </div>
                            {i < 3 && <div className={`h-0.5 w-12 ${step > n ? "bg-gold" : "bg-border"}`} />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <>
                        <h1 className="mt-10 text-center font-serif text-3xl font-bold">Account</h1>
                        <p className="mt-1 text-center text-sm">Create your account</p>
                        <form className="mt-8 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                            <div>
                                <label className="text-sm font-medium">Email *</label>
                                <div className="mt-1.5 relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        required 
                                        type="email" 
                                        value={data.email} 
                                        onChange={(e) => setData({ ...data, email: e.target.value })} 
                                        placeholder="you@example.com" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Username (Optional)</label>
                                <div className="mt-1.5 relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        type="text" 
                                        value={data.username} 
                                        onChange={(e) => setData({ ...data, username: e.target.value })} 
                                        placeholder="e.g., juan_dela_cruz" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Used for your public profile URL</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Password *</label>
                                <div className="mt-1.5 relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        required 
                                        type={showPwd ? "text" : "password"} 
                                        value={data.password} 
                                        onChange={(e) => setData({ ...data, password: e.target.value })} 
                                        placeholder="••••••••" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPwd((v) => !v)} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gold"
                                    >
                                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Confirm Password *</label>
                                <div className="mt-1.5 relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        required 
                                        type={showConfirm ? "text" : "password"} 
                                        value={data.confirm} 
                                        onChange={(e) => setData({ ...data, confirm: e.target.value })} 
                                        placeholder="••••••••" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirm((v) => !v)} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gold"
                                    >
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
                                    <label className="text-sm font-medium">First Name *</label>
                                    <input 
                                        required 
                                        value={data.firstName} 
                                        onChange={(e) => setData({ ...data, firstName: e.target.value })} 
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                        placeholder="Juan"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Last Name *</label>
                                    <input 
                                        required 
                                        value={data.lastName} 
                                        onChange={(e) => setData({ ...data, lastName: e.target.value })} 
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                        placeholder="Dela Cruz"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number (Optional)</label>
                                <div className="mt-1.5 relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        value={data.phoneNum} 
                                        onChange={(e) => setData({ ...data, phoneNum: e.target.value })} 
                                        placeholder="09123456789 or +639123456789" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">For course updates and notifications</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Location (Optional)</label>
                                <div className="mt-1.5 relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                    <input 
                                        value={data.location} 
                                        onChange={(e) => setData({ ...data, location: e.target.value })} 
                                        placeholder="e.g., Manila, Philippines" 
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Short Bio (Optional)</label>
                                <div className="mt-1.5 relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gold" />
                                    <textarea 
                                        value={data.bio} 
                                        onChange={(e) => setData({ ...data, bio: e.target.value })} 
                                        placeholder="Tell us a bit about yourself and why you're interested in Filipino culture..." 
                                        rows={3}
                                        className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" 
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Max 200 characters</p>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                                    Back
                                </Button>
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
                        <p className="mt-1 text-center text-sm">Pick what you love (Optional)</p>
                        <div className="mt-8 flex flex-wrap gap-2 justify-center">
                            {interests.map((i) => (
                                <button 
                                    key={i} 
                                    type="button" 
                                    onClick={() => toggleInterest(i)} 
                                    className={`rounded-full border px-4 py-2 text-sm transition ${
                                        data.interests.includes(i) 
                                            ? "border-gold bg-gold text-gold-foreground" 
                                            : "border-border hover:border-gold hover:bg-gold/10"
                                    }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex gap-3">
                            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <Button 
                                type="button" 
                                size="lg" 
                                className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground" 
                                onClick={handleCreateAccount}
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}