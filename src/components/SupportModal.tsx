// src/components/SupportModal.tsx
import { useState, useEffect } from "react";
import { X, Bug, MessageCircle, Mail, Send, AlertCircle, CheckCircle, HelpCircle, CreditCard, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type ProblemType = "bug" | "technical" | "billing" | "content" | "account" | "other";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "learner" | "mentor";
}

const problemTypes: { value: ProblemType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "bug", label: "Bug or Glitch", icon: <Bug className="h-4 w-4" />, description: "Something isn't working correctly" },
  { value: "technical", label: "Technical Issue", icon: <AlertCircle className="h-4 w-4" />, description: "Video not loading, login issues, etc." },
  { value: "billing", label: "Billing / Payment", icon: <CreditCard className="h-4 w-4" />, description: "Issues with payments or refunds" },
  { value: "content", label: "Course Content Issue", icon: <BookOpen className="h-4 w-4" />, description: "Wrong information, broken links, etc." },
  { value: "account", label: "Account Problem", icon: <User className="h-4 w-4" />, description: "Profile, settings, or access issues" },
  { value: "other", label: "Other", icon: <Mail className="h-4 w-4" />, description: "Something else" },
];

export function SupportModal({ isOpen, onClose, userRole }: SupportModalProps) {
  const [problemType, setProblemType] = useState<ProblemType | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load user email on mount
  useEffect(() => {
    if (isOpen) {
      const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
      setEmail(userEmail);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!problemType) {
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

    // Get user info
    const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "User";

    // Create support ticket
    const ticket = {
      id: `TKT-${Date.now()}`,
      userRole,
      userName,
      userEmail: email,
      problemType,
      subject: subject.trim(),
      description: description.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const tickets = JSON.parse(localStorage.getItem("sandiwa.supportTickets") || "[]");
    tickets.push(ticket);
    localStorage.setItem("sandiwa.supportTickets", JSON.stringify(tickets));

    toast.success("Support ticket submitted! We'll respond within 24 hours.");
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setProblemType("");
      setSubject("");
      setDescription("");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="font-serif text-xl font-bold text-navy">Ticket Submitted!</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Our support team will review your issue and respond within 24 hours.
          </p>
          <Button onClick={onClose} className="mt-6 bg-gold hover:bg-gold/90 text-white w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy">Report a Problem</h2>
            <p className="text-xs text-muted-foreground">
              Help us improve Sandiwa by reporting issues
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Problem Type */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              What type of problem are you experiencing? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {problemTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setProblemType(type.value)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-lg border transition ${
                    problemType === type.value
                      ? "border-gold bg-gold/10"
                      : "border-gray-200 hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              Your Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="We'll send updates to this email"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Please describe the problem in detail. Include steps to reproduce if applicable."
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-muted-foreground mt-1">{description.length}/1000 characters</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Our support team typically responds within 24 hours. For urgent issues, 
              you can also email us directly at <strong>support@sandiwa.com</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !problemType || !subject.trim() || !description.trim() || !email.trim()}
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
      </div>
    </div>
  );
}