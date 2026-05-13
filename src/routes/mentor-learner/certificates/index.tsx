import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Award, Download, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { courses } from "@/data";

// Define enrolled course type
interface EnrolledCourse {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  enrolledAt: string;
  progress: number;
}

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  completedAt: string;
  certificateUrl: string;
}

export const Route = createFileRoute("/mentor-learner/certificates/")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sandiwa.enrolled");
    const enrolled: EnrolledCourse[] = stored ? JSON.parse(stored) : [];
    const completed = enrolled.filter((c: EnrolledCourse) => c.progress === 100);
    
    const certs = completed.map((c: EnrolledCourse) => {
      const course = courses.find(crs => crs.id === c.id);
      return {
        id: c.id,
        courseId: c.id,
        courseTitle: course?.title || c.title,
        completedAt: c.enrolledAt || new Date().toISOString(),
        certificateUrl: `/certificates/${c.id}.pdf`,
      };
    });
    
    setCertificates(certs);
  }, []);

  const downloadCertificate = (cert: Certificate) => {
    alert(`Downloading certificate for ${cert.courseTitle}`);
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <div className="bg-cream min-h-screen py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-gold mx-auto mb-3" />
              <h1 className="font-serif text-4xl font-bold text-navy">My Certificates</h1>
              <p className="text-muted-foreground mt-2">Celebrate your learning achievements</p>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-border bg-card">
                <p className="text-muted-foreground">No certificates yet. Complete a course to earn one!</p>
                <Button asChild className="mt-4 bg-gold hover:bg-gold/90">
                  <Link to="/mentor-learner/courses/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">{cert.courseTitle}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> 
                            Completed: {new Date(cert.completedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" /> Verified
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => downloadCertificate(cert)} variant="outline" className="border-gold text-gold">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}