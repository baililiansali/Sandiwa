import { Award, Calendar, Star, CheckCircle, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface CertificateGeneratorProps {
  studentName: string;
  courseName: string;
  completionDate?: Date;
  instructorName?: string;
  grade?: string;
  certificateId?: string;
}

export function CertificateGenerator({
  studentName,
  courseName,
  completionDate = new Date(),
  instructorName = "Sandiwa Academy",
  grade = "Pass with Distinction",
  certificateId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
}: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    toast.loading("Generating your certificate...");
    
    // Simulate PDF generation
    setTimeout(() => {
      toast.dismiss();
      toast.success("Certificate downloaded successfully!");
      setIsGenerating(false);
    }, 2000);
  };

  const handleShare = () => {
    toast.success("Certificate link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Certificate Card */}
      <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden border-8 border-double border-gold/30">
        {/* Decorative Borders */}
        <div className="absolute inset-2 border-2 border-gold/20 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-4 border border-gold/10 rounded-lg pointer-events-none"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-gold rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-gold rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-gold rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-gold rounded-br-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative p-12 text-center">
          {/* Header */}
          <div className="mb-8">
            <Award className="h-20 w-20 text-gold mx-auto mb-4" />
            <div className="inline-block px-6 py-2 bg-gold/10 rounded-full">
              <span className="text-gold font-semibold tracking-wide">CERTIFICATE OF COMPLETION</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-serif font-bold text-navy mb-4">Certificate of Achievement</h1>
          
          {/* Body */}
          <p className="text-lg text-muted-foreground mb-6">
            This certificate is proudly presented to
          </p>
          
          <h2 className="text-4xl font-bold text-gold mb-6 font-serif">
            {studentName}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            for successfully completing the course
          </p>
          
          <h3 className="text-2xl font-bold text-navy mb-8 font-serif italic">
            "{courseName}"
          </h3>

          {/* Grade Section */}
          {grade && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <Star className="h-4 w-4 text-green-600 fill-green-600" />
              <span className="text-green-800 font-semibold">{grade}</span>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <Calendar className="h-4 w-4 text-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Date of Completion</p>
              <p className="text-sm font-semibold text-navy">{formatDate(completionDate)}</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-4 w-4 text-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Certificate ID</p>
              <p className="text-sm font-semibold text-navy">{certificateId}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t border-gold/20">
            <div>
              <div className="border-b-2 border-gold/40 w-3/4 mx-auto mb-1"></div>
              <p className="text-sm font-semibold text-navy">{instructorName}</p>
              <p className="text-xs text-muted-foreground">Course Instructor</p>
            </div>
            <div>
              <div className="border-b-2 border-gold/40 w-3/4 mx-auto mb-1"></div>
              <p className="text-sm font-semibold text-navy">Sandiwa Academy</p>
              <p className="text-xs text-muted-foreground">Authorized Signatory</p>
            </div>
          </div>

          {/* Seal */}
          <div className="absolute bottom-8 right-8 opacity-20">
            <div className="w-24 h-24 rounded-full border-4 border-gold flex items-center justify-center">
              <Award className="h-12 w-12 text-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <Button onClick={handleDownload} disabled={isGenerating} className="bg-gold hover:bg-gold/90">
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Download Certificate (PDF)"}
        </Button>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Certificate
        </Button>
      </div>

      {/* Verification Note */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        This certificate can be verified using the certificate ID at sandiwa.com/verify
      </p>
    </div>
  );
}