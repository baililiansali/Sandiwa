import { useState } from "react";
import { CertificateGenerator } from "./CertificateGenerator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface StudentCertificateProps {
  studentData: {
    name: string;
    courseName: string;
    completionDate: string;
    grade: string;
  };
  onBack?: () => void;
}

export function StudentCertificate({ studentData, onBack }: StudentCertificateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-yellow-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-navy hover:text-gold"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        <CertificateGenerator
          studentName={studentData.name}
          courseName={studentData.courseName}
          completionDate={new Date(studentData.completionDate)}
          instructorName="Maria Santos"
          grade={studentData.grade}
        />
      </div>
    </div>
  );
}