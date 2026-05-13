import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, CheckCircle, Award, Users, Briefcase, GraduationCap, Twitter, Linkedin, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/apply-mentor")({
  head: () => ({
    meta: [
      { title: "Apply to Become a Mentor — Sandiwa" },
      { name: "description", content: "Share your expertise in Filipino culture and language. Apply to become a mentor today." },
    ],
  }),
  component: ApplyMentorPage,
});

function ApplyMentorPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    expertise: "",
    experience: "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
    // File uploads
    resume: null as File | null,
    certificate: null as File | null,
    idProof: null as File | null,
  });

  const expertiseAreas = [
    "Filipino Language",
    "Philippine History",
    "Traditional Arts & Crafts",
    "Filipino Music & Dance",
    "Filipino Cuisine",
    "Cultural Heritage",
    "Literature",
    "Film & Cinema",
  ];

  const handleGoBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      router.history.back();
    } else {
      // Fallback to home if no history
      navigate({ to: "/" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, JPEG, or PNG files only");
        return;
      }
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.expertise || !formData.experience) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.resume) {
      toast.error("Please upload your resume/CV");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Store mentor application in localStorage for admin review
      const application = {
        id: Date.now(),
        ...formData,
        status: "pending",
        appliedAt: new Date().toISOString(),
      };
      
      const applications = JSON.parse(localStorage.getItem("sandiwa.mentor.applications") || "[]");
      applications.push(application);
      localStorage.setItem("sandiwa.mentor.applications", JSON.stringify(applications));
      
      toast.success("Application submitted successfully! We'll review your application and get back to you within 3-5 business days.");
      setIsSubmitting(false);
      navigate({ to: "/mentor-application-success" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1 text-sm text-gold">
            <Award className="h-4 w-4" />
            Become a Mentor
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-navy">
            Share Your Expertise
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join our community of mentors and help preserve Filipino culture by teaching others.
            Fill out the form below to start your journey.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy mb-4">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="juan@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="09123456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Area of Expertise *</label>
                  <select
                    required
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select your expertise</option>
                    {expertiseAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy mb-4">Professional Background</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Years of Experience *</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Short Bio / Teaching Philosophy *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Tell us about your experience, teaching style, and why you want to share Filipino culture..."
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy mb-4">Social Links (Optional)</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Personal website or portfolio"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Twitter/X username"
                  />
                </div>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy mb-4">Supporting Documents</h2>
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-gold transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <label className="mt-2 block text-sm font-medium">Resume/CV *</label>
                  <p className="text-xs text-muted-foreground">PDF, JPEG, or PNG (Max 5MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className="mt-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold-foreground hover:file:bg-gold/90"
                  />
                  {formData.resume && (
                    <p className="mt-2 text-xs text-green-600">✓ {formData.resume.name} uploaded</p>
                  )}
                </div>

                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-gold transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <label className="mt-2 block text-sm font-medium">Teaching Certificate / Diploma</label>
                  <p className="text-xs text-muted-foreground">Professional certification or degree (Optional)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "certificate")}
                    className="mt-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold-foreground hover:file:bg-gold/90"
                  />
                  {formData.certificate && (
                    <p className="mt-2 text-xs text-green-600">✓ {formData.certificate.name} uploaded</p>
                  )}
                </div>

                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-gold transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <label className="mt-2 block text-sm font-medium">Government ID</label>
                  <p className="text-xs text-muted-foreground">For verification purposes (Optional)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "idProof")}
                    className="mt-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold-foreground hover:file:bg-gold/90"
                  />
                  {formData.idProof && (
                    <p className="mt-2 text-xs text-green-600">✓ {formData.idProof.name} uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Application →"
                )}
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                By submitting this application, you agree to our Mentor Terms of Service and Privacy Policy.
                Our team will review your application and contact you within 3-5 business days.
              </p>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold text-navy">Global Reach</h3>
            <p className="text-xs text-muted-foreground">Connect with learners worldwide</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold text-navy">Earn Recognition</h3>
            <p className="text-xs text-muted-foreground">Get certified as a culture expert</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold text-navy">Monetize Skills</h3>
            <p className="text-xs text-muted-foreground">Earn from your courses</p>
          </div>
        </div>
      </div>
    </div>
  );
}