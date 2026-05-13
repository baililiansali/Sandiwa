import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learner/payment-success")({
    component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
    return (
        <AuthGuard>
            <SiteLayout>
                <div className="flex min-h-[60vh] items-center justify-center px-4">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h1 className="mt-4 font-serif text-3xl font-bold text-navy">Payment Successful!</h1>
                        <p className="mt-2 text-muted-foreground">
                            Thank you for your purchase. You now have access to your courses.
                        </p>
                        <div className="mt-6 flex gap-3 justify-center">
                            <Button asChild className="bg-gold hover:bg-gold/90">
                                <Link to="/learner/courses/courses">Go to My Courses</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link to="/learner/courses/courses">Browse More Courses</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </AuthGuard>
    );
}