// src/routes/support.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Send, Bug, AlertCircle, CreditCard, 
  User, BookOpen, Mail, HelpCircle, CheckCircle, 
  MessageCircle, Phone, Clock, ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type ProblemType = "bug" | "technical" | "billing" | "content" | "account" | "other";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Sandiwa" },
      { name: "description", content: "Get help and support from Sandiwa." },
    ],
  }),
  component: SupportPage,
});

const problemTypes: { value: ProblemType; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { value: "bug", label: "Bug or Glitch", icon: <Bug className="h-5 w-5" />, description: "Something isn't working correctly", color: "from-red-500 to-red-600" },
  { value: "technical", label: "Technical Issue", icon: <AlertCircle className="h-5 w-5" />, description: "Video not loading, login issues, etc.", color: "from-orange-500 to-orange-600" },
  { value: "billing", label: "Billing / Payment", icon: <CreditCard className="h-5 w-5" />, description: "Issues with payments or refunds", color: "from-green-500 to-green-600" },
  { value: "content", label: "Course Content Issue", icon: <BookOpen className="h-5 w-5" />, description: "Wrong information, broken links, etc.", color: "from-blue-500 to-blue-600" },
  { value: "account", label: "Account Problem", icon: <User className="h-5 w-5" />, description: "Profile, settings, or access issues", color: "from-purple-500 to-purple-600" },
  { value: "other", label: "Other", icon: <Mail className="h-5 w-5" />, description: "Something else", color: "from-gray-500 to-gray-600" },
];

function SupportPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProblemType | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState<"learner" | "mentor">("learner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "learner";
    setUserRole(role as "learner" | "mentor");
    
    const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    setEmail(userEmail);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: `/${userRole}/dashboard` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast.error("Please select a problem type");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!description.trim()) {
      toast.error("Please describe the problem");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "User";
      const newTicketId = `TKT-${Date.now()}`;
      
      const ticket = {
        id: newTicketId,
        userRole,
        userName,
        userEmail: email,
        problemType: selectedType,
        subject: subject.trim(),
        description: description.trim(),
        status: "open",
        createdAt: new Date().toISOString(),
      };

      const tickets = JSON.parse(localStorage.getItem("sandiwa.supportTickets") || "[]");
      tickets.push(ticket);
      localStorage.setItem("sandiwa.supportTickets", JSON.stringify(tickets));

      setTicketId(newTicketId);
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast.success("Support ticket submitted successfully!");
    }, 1500);
  };

  if (submitted) {
    return (
      <AuthGuard>
        <SiteLayout>
          <div className="bg-cream min-h-screen py-20">
            <div className="mx-auto max-w-2xl px-4">
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-navy">Ticket Submitted Successfully!</h1>
                <p className="text-muted-foreground mt-2">Your ticket ID: <span className="font-mono font-bold text-gold">{ticketId}</span></p>
                <p className="text-sm text-muted-foreground mt-4">
                  Our support team will review your issue and respond within 24 hours.
                  We'll send updates to <strong>{email}</strong>.
                </p>
                <div className="mt-8 flex gap-3 justify-center">
                  <Button onClick={handleGoBack} className="bg-gold hover:bg-gold/90 text-white">
                    Return to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedType(null);
                      setSubject("");
                      setDescription("");
                    }}
                  >
                    Submit Another Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SiteLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SiteLayout>
        <div className="bg-cream min-h-screen py-10">
          <div className="mx-auto max-w-4xl px-4">
            {/* Back Button */}
            <button 
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold/10 text-gold mb-4">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-navy">How can we help you?</h1>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                We're here to assist you with any issues or questions you may have.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Left Side - Contact Info */}
              <div className="md:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                  <h2 className="font-serif text-lg font-bold text-navy mb-4">Other Ways to Reach Us</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Email Support</p>
                        <p className="text-xs text-muted-foreground">support@sandiwa.com</p>
                        <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Live Chat</p>
                        <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM PHT</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Phone Support</p>
                        <p className="text-xs text-muted-foreground">+63 (2) 1234 5678</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gold" />
                        <span className="text-muted-foreground">Average response time: &lt; 24 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Link */}
                  {/* <div className="mt-6 pt-4 border-t border-border">
                    <Link 
                      to="/faq" 
                      className="flex items-center justify-between text-sm text-gold hover:underline"
                    >
                      <span>Visit our FAQ</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div> */}
                </div>
              </div>

              {/* Right Side - Report Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-3">
                      What type of problem are you experiencing? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {problemTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setSelectedType(type.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedType === type.value
                              ? `border-gold bg-gradient-to-r ${type.color} bg-opacity-5`
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                            selectedType === type.value 
                              ? `bg-gradient-to-r ${type.color} text-white`
                              : "bg-muted text-gold"
                          } mb-2`}>
                            {type.icon}
                          </div>
                          <p className={`font-medium text-sm ${
                            selectedType === type.value ? "text-navy" : "text-navy"
                          }`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your issue"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{subject.length}/100 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="We'll send updates to this email"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Please describe the problem in detail. Include steps to reproduce if applicable, and any error messages you're seeing."
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{description.length}/2000 characters</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Before submitting, please:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Check if you're using the latest version of your browser</li>
                        <li>Try clearing your browser cache and cookies</li>
                        <li>Include screenshots if possible (you can email them separately)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoBack}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedType || !subject.trim() || !description.trim()}
                      className="flex-1 bg-gold hover:bg-gold/90 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    </AuthGuard>
  );
}