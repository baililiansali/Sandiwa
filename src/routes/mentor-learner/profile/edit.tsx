import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, User, Phone, Calendar, Save, Camera, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor-learner/profile/edit")({
    head: () => ({
        meta: [
            { title: "Edit Profile — Sandiwa" },
            { name: "description", content: "Update your profile information." },
        ],
    }),
    component: EditProfilePage,
});

function EditProfilePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        birthday: "",
        occupation: "",
        interests: [] as string[],
    });

    const interestOptions = [
        "Filipino Language",
        "History",
        "Arts & Crafts",
        "Music & Dance",
        "Cuisine",
        "Heritage",
        "Literature",
        "Film & Cinema",
    ];

    useEffect(() => {
        setIsMounted(true);
        
        const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";
        const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
        const userProfile = JSON.parse(localStorage.getItem("sandiwa.profile") || "{}");
    
        setFormData({
            fullName: userName,
            email: userEmail,
            phone: userProfile.phone || "",
            location: userProfile.location || "Quezon City, PH",
            bio: userProfile.bio || "",
            birthday: userProfile.birthday || "",
            occupation: userProfile.occupation || "",
            interests: userProfile.interests || [],
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            localStorage.setItem("userName", formData.fullName);
            sessionStorage.setItem("userName", formData.fullName);
            localStorage.setItem("userEmail", formData.email);
            sessionStorage.setItem("userEmail", formData.email);
            
            const profileData = {
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                birthday: formData.birthday,
                occupation: formData.occupation,
                interests: formData.interests,
            };
            localStorage.setItem("sandiwa.profile", JSON.stringify(profileData));
            
            const initials = formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase();
            localStorage.setItem("userInitials", initials);
            sessionStorage.setItem("userInitials", initials);
            
            toast.success("Profile updated successfully!");
            setIsLoading(false);
            navigate({ to: "/learner/profile" });
        }, 1000);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <AuthGuard>
            <MentorDashboardLayout>
                <div className="bg-cream min-h-screen py-10">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <Link to="/mentor-learner/profile" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6">
                            <ArrowLeft className="h-4 w-4" /> Back to profile
                        </Link>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-3xl font-serif font-bold">
                                        {formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                                    </div>
                                    <button className="absolute bottom-0 right-0 rounded-full bg-gold p-2 text-white hover:bg-gold/90 transition">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                                <h1 className="mt-4 font-serif text-2xl font-bold text-navy">Edit Profile</h1>
                                <p className="text-sm text-muted-foreground">Update your personal information</p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Full Name *</label>
                                        <div className="mt-1.5 relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email *</label>
                                        <div className="mt-1.5 relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <div className="mt-1.5 relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+63 912 345 6789"
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Location</label>
                                        <div className="mt-1.5 relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="City, Country"
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Birthday</label>
                                        <div className="mt-1.5 relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Occupation</label>
                                        <input
                                            type="text"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Teacher, Student, Designer"
                                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself..."
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                                    />
                                </div>

                                {/* Interests Section */}
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Star className="h-4 w-4 text-gold" />
                                        Interests
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-1">Select topics you're interested in</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {interestOptions.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`rounded-full border px-4 py-2 text-sm transition ${
                                                    formData.interests.includes(interest)
                                                        ? "border-gold bg-gold text-white"
                                                        : "border-border hover:border-gold hover:bg-gold/10"
                                                }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Display selected interests as tags */}
                                    {formData.interests.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs text-muted-foreground mb-2">Your selected interests:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.interests.map((interest, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                                                    >
                                                        {interest}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleInterest(interest)}
                                                            className="hover:text-red-500 transition ml-1"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                        onClick={() => navigate({ to: "/learner/profile" })}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1 bg-gold hover:bg-gold/90 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Saving...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MentorDashboardLayout>
        </AuthGuard>
    );
}