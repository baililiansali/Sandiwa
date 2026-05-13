import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mentor-application-success")({
  head: () => ({
    meta: [
      { title: "Application Submitted — Sandiwa" },
      { name: "description", content: "Your mentor application has been submitted successfully." },
    ],
  }),
  component: ApplicationSuccessPage,
});

function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-navy">Application Submitted!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your interest in becoming a Sandiwa mentor. Our team will review your application and get back to you within 3-5 business days.
        </p>
        
        <div className="mt-8 rounded-lg bg-gold/5 border border-gold/20 p-4 text-left">
          <h3 className="font-semibold text-navy flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" />
            What's next?
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Our team will review your credentials</li>
            <li>• You'll receive an email with next steps</li>
            <li>• If approved, you can start creating courses</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <Button asChild className="bg-gold hover:bg-gold/90">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/learner/courses/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}