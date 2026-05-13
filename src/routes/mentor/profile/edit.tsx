import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, User, Phone, Calendar, Save, Camera, Briefcase, GraduationCap, Star, Globe, Linkedin, Twitter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor/profile/edit")({
    head: () => ({
        meta: [
            { title: "Edit Mentor Profile — Sandiwa" },
            { name: "description", content: "Update your mentor profile information." },
        ],
    }),
    component: EditMentorProfilePage,
});

function EditMentorProfilePage() {
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
        credentials: [] as string[],
        skills: [] as string[],
        interests: [] as string[],
        socialLinks: {
            twitter: "",
            linkedin: "",
            website: "",
        },
    });

    const [newCredential, setNewCredential] = useState("");
    const [newSkill, setNewSkill] = useState("");

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
        
        const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Jose Reyes";
        const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "mentor.jose@gmail.com";
        const mentorProfile = JSON.parse(localStorage.getItem("sandiwa.mentorProfile") || "{}");
        
        setFormData({
            fullName: userName,
            email: userEmail,
            phone: mentorProfile.phone || "",
            location: mentorProfile.location || "Manila, Philippines",
            bio: mentorProfile.bio || "Passionate historian with over 15 years of experience studying and teaching Philippine history. I believe in making history come alive through engaging stories and primary sources.",
            birthday: mentorProfile.birthday || "",
            occupation: mentorProfile.occupation || "History Professor & Heritage Consultant",
            credentials: mentorProfile.credentials || [
                "PhD in Philippine History - University of Santo Tomas",
                "MA in Southeast Asian Studies - Ateneo de Manila University",
                "Certified Heritage Documentation Specialist"
            ],
            skills: mentorProfile.skills || [
                "Philippine Historiography",
                "Archival Research",
                "Oral History Documentation",
                "Curriculum Development",
                "Public Speaking",
                "Heritage Conservation"
            ],
            interests: mentorProfile.interests || ["History", "Heritage", "Literature"],
            socialLinks: mentorProfile.socialLinks || {
                twitter: "",
                linkedin: "",
                website: "",
            },
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (platform: string, value: string) => {
        setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, [platform]: value }
        });
    };

    const addCredential = () => {
        if (newCredential.trim() && !formData.credentials.includes(newCredential.trim())) {
            setFormData({
                ...formData,
                credentials: [...formData.credentials, newCredential.trim()]
            });
            setNewCredential("");
        }
    };

    const removeCredential = (credential: string) => {
        setFormData({
            ...formData,
            credentials: formData.credentials.filter(c => c !== credential)
        });
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skill)
        });
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
            
            const mentorProfileData = {
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                birthday: formData.birthday,
                occupation: formData.occupation,
                credentials: formData.credentials,
                skills: formData.skills,
                interests: formData.interests,
                socialLinks: formData.socialLinks,
            };
            localStorage.setItem("sandiwa.mentorProfile", JSON.stringify(mentorProfileData));
            
            const initials = formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase();
            localStorage.setItem("userInitials", initials);
            sessionStorage.setItem("userInitials", initials);
            
            toast.success("Mentor profile updated successfully!");
            setIsLoading(false);
            navigate({ to: "/mentor/profile" });
        }, 1000);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <MentorDashboardLayout>
            <div className="bg-cream min-h-screen py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <Link to="/mentor/profile" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6">
                        <ArrowLeft className="h-4 w-4" /> Back to profile
                    </Link>

                    <div className="rounded-xl border border-border bg-white p-6">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-white text-3xl font-serif font-bold">
                                    {formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase() || "JR"}
                                </div>
                                <button className="absolute bottom-0 right-0 rounded-full bg-gold p-2 text-white hover:bg-gold/90 transition">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <h1 className="mt-4 font-serif text-2xl font-bold text-navy">Edit Mentor Profile</h1>
                            <p className="text-sm text-muted-foreground">Update your professional information and expertise</p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h2 className="font-serif text-lg font-semibold text-navy mb-4">Basic Information</h2>
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

                                <div className="grid gap-6 sm:grid-cols-2 mt-4">
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

                                <div className="grid gap-6 sm:grid-cols-2 mt-4">
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
                                        <label className="text-sm font-medium">Occupation / Title</label>
                                        <div className="mt-1.5 relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Professor, Historian, Cultural Expert"
                                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={5}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell your students about your background, teaching philosophy, and expertise..."
                                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                                />
                            </div>

                            {/* Credentials */}
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-gold" />
                                    Credentials & Certifications
                                </label>
                                <div className="mt-2 flex flex-wrap gap-2 mb-2">
                                    {formData.credentials.map((credential, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                                        >
                                            {credential}
                                            <button
                                                type="button"
                                                onClick={() => removeCredential(credential)}
                                                className="hover:text-red-500 transition"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCredential}
                                        onChange={(e) => setNewCredential(e.target.value)}
                                        placeholder="Add a credential (e.g., PhD in History)"
                                        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCredential())}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addCredential}
                                        variant="outline"
                                        className="border-gold text-gold hover:bg-gold hover:text-white"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Star className="h-4 w-4 text-gold" />
                                    Skills & Expertise
                                </label>
                                <div className="mt-2 flex flex-wrap gap-2 mb-2">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-red-500 transition"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill (e.g., Archival Research)"
                                        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addSkill}
                                        variant="outline"
                                        className="border-gold text-gold hover:bg-gold hover:text-white"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="text-sm font-medium">Interests & Specializations</label>
                                <p className="text-xs text-muted-foreground mt-1">Select topics you're passionate about teaching</p>
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
                            </div>

                            {/* Social Links */}
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-gold" />
                                    Social & Professional Links
                                </label>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Twitter className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={formData.socialLinks.twitter}
                                            onChange={(e) => handleSocialChange("twitter", e.target.value)}
                                            placeholder="Twitter URL"
                                            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={formData.socialLinks.linkedin}
                                            onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                                            placeholder="LinkedIn URL"
                                            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={formData.socialLinks.website}
                                            onChange={(e) => handleSocialChange("website", e.target.value)}
                                            placeholder="Personal Website or Portfolio"
                                            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                    onClick={() => navigate({ to: "/mentor/profile" })}
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
    );
}