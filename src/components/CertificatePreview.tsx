import { Award, Calendar, CheckCircle, Star } from "lucide-react";

interface CertificatePreviewProps {
  studentName?: string;
  courseName: string;
  courseDescription?: string;
  instructorName?: string;
  completionDate?: Date;
  certificateId?: string;
  customMessage?: string;
  design?: string;
  customTemplate?: {
    type: "image" | "url";
    value: string;
    preview?: string;
  };
}

export function CertificatePreview({ 
  studentName = "[Student Name]",
  courseName,
  courseDescription = "A comprehensive course covering essential knowledge and skills",
  instructorName = "Maria Santos",
  completionDate = new Date(),
  certificateId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  customMessage,
  design = "modern",
  customTemplate
}: CertificatePreviewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (customTemplate) {
    return (
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
        <img 
          src={customTemplate.value} 
          alt="Certificate Template"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white bg-black/50 p-6 rounded-lg max-w-md">
            <p className="text-sm">Certificate content will be overlaid on your template</p>
            <p className="text-xs mt-2">Student name, course, and date will be added automatically</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden border-8 border-double border-gold/30">
      <div className="absolute inset-2 border-2 border-gold/20 rounded-xl pointer-events-none"></div>
      <div className="absolute inset-4 border border-gold/10 rounded-lg pointer-events-none"></div>
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-gold rounded-tl-3xl"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-gold rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-gold rounded-bl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-gold rounded-br-3xl"></div>
      </div>

      <div className="relative p-8 text-center">
        <div className="mb-6">
          <Award className="h-16 w-16 text-gold mx-auto mb-3" />
          <div className="inline-block px-6 py-2 bg-gold/10 rounded-full">
            <span className="text-gold font-semibold tracking-wide">CERTIFICATE OF COMPLETION</span>
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-navy mb-3">Certificate of Achievement</h1>
        
        <p className="text-base text-muted-foreground mb-4">
          This certificate is proudly presented to
        </p>
        
        <h2 className="text-3xl font-bold text-gold mb-4 font-serif">
          {studentName}
        </h2>
        
        <p className="text-base text-muted-foreground mb-4">
          for successfully completing the course
        </p>
        
        <h3 className="text-xl font-bold text-navy mb-4 font-serif italic">
          "{courseName}"
        </h3>

        <div className="mb-6 px-6 py-3 bg-gold/5 rounded-lg max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground">{courseDescription}</p>
        </div>

        {customMessage && (
          <div className="mb-6 px-6 py-3 bg-gold/5 rounded-lg italic">
            <p className="text-sm text-muted-foreground">"{customMessage}"</p>
          </div>
        )}

        {design === "modern" && (
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
            <Star className="h-4 w-4 text-green-600 fill-green-600" />
            <span className="text-green-800 font-semibold">Pass with Distinction</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
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

        <div className="grid grid-cols-2 gap-8 mt-6 pt-4 border-t border-gold/20">
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

        <div className="absolute bottom-6 right-6 opacity-20">
          <div className="w-20 h-20 rounded-full border-4 border-gold flex items-center justify-center">
            <Award className="h-10 w-10 text-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}