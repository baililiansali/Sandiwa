import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Award, Download, Eye, Plus, 
  Calendar, Trophy, Edit, Trash2, Send, X, Image
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { courses } from "@/data/mockCourses";
import { CertificatePreview } from "@/components/CertificatePreview";
import { CertificateModal, CertificateFormData } from "@/components/CertificateModal";

export const Route = createFileRoute("/mentor/courses/manage/certificates")({
  component: CertificateManagementPage,
});

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  templateName: string;
  design: string;
  issueCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  customMessage?: string;
  description?: string;
  completionDate?: string;
  customTemplate?: {
    type: "image" | "url";
    value: string;
    preview?: string;
  };
}

function CertificateManagementPage() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("certificates");
    if (saved) {
      setCertificates(JSON.parse(saved));
    } else {
      setCertificates([
        {
          id: "cert1",
          courseId: "1",
          courseTitle: "Philippine History and Heritage Masterclass",
          templateName: "Standard Certificate",
          design: "modern",
          issueCount: 45,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          description: "Master the rich history and cultural heritage of the Philippines",
          completionDate: new Date().toISOString().split('T')[0]
        }
      ]);
    }
  }, []);

  const handleCreateCertificate = (formData: CertificateFormData) => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }
    if (!formData.templateName) {
      toast.error("Please enter a template name");
      return;
    }

    if (formData.templateType === "image" && !formData.customImage) {
      toast.error("Please upload a certificate template image");
      return;
    }

    if (formData.templateType === "url" && !formData.customUrl) {
      toast.error("Please enter a valid URL for the certificate template");
      return;
    }

    const course = courses.find(c => c.id === selectedCourse);
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      courseId: selectedCourse,
      courseTitle: course?.title || "",
      templateName: formData.templateName,
      design: formData.design,
      issueCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customMessage: formData.customMessage,
      description: formData.description,
      completionDate: formData.completionDate,
      customTemplate: formData.templateType !== "builtin" ? {
        type: formData.templateType,
        value: formData.templateType === "image" ? formData.customImagePreview : formData.customUrl,
        preview: formData.customImagePreview
      } : undefined
    };

    const updated = [...certificates, newCert];
    setCertificates(updated);
    localStorage.setItem("certificates", JSON.stringify(updated));
    toast.success("Certificate template created!");
    setShowCreateModal(false);
    setSelectedCourse("");
  };

  const handleEditCertificate = (formData: CertificateFormData) => {
    if (!editingCertificate) return;
    
    const updatedCertificates = certificates.map(cert => 
      cert.id === editingCertificate.id 
        ? { 
            ...editingCertificate,
            templateName: formData.templateName,
            design: formData.design,
            customMessage: formData.customMessage,
            description: formData.description,
            completionDate: formData.completionDate,
            updatedAt: new Date().toISOString(),
            customTemplate: formData.customImagePreview ? {
              type: "image" as const,
              value: formData.customImagePreview,
              preview: formData.customImagePreview
            } : editingCertificate.customTemplate
          }
        : cert
    );
    
    setCertificates(updatedCertificates);
    localStorage.setItem("certificates", JSON.stringify(updatedCertificates));
    toast.success("Certificate template updated successfully!");
    setShowEditModal(false);
    setEditingCertificate(null);
  };

  const handleToggleActive = (certId: string) => {
    const updated = certificates.map(cert => 
      cert.id === certId ? { ...cert, isActive: !cert.isActive, updatedAt: new Date().toISOString() } : cert
    );
    setCertificates(updated);
    localStorage.setItem("certificates", JSON.stringify(updated));
    toast.success(`Certificate ${updated.find(c => c.id === certId)?.isActive ? "activated" : "deactivated"}`);
  };

  const handleDeleteCertificate = (certId: string) => {
    if (confirm("Are you sure you want to delete this certificate template? This action cannot be undone.")) {
      const updated = certificates.filter(cert => cert.id !== certId);
      setCertificates(updated);
      localStorage.setItem("certificates", JSON.stringify(updated));
      toast.success("Certificate template deleted");
    }
  };

  const handlePreview = (cert: Certificate) => {
    setPreviewCertificate(cert);
    setShowPreviewModal(true);
  };

  const handleIssueToAll = async (certId: string) => {
    toast.loading("Issuing certificates to all students...");
    setTimeout(() => {
      const updated = certificates.map(cert => 
        cert.id === certId ? { ...cert, issueCount: cert.issueCount + 1, updatedAt: new Date().toISOString() } : cert
      );
      setCertificates(updated);
      localStorage.setItem("certificates", JSON.stringify(updated));
      toast.dismiss();
      toast.success("Certificates issued to all enrolled students!");
    }, 2000);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/mentor/courses" });
    }
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back 
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Certificates</h1>
              <p className="text-muted-foreground mt-1">Create and manage course completion certificates</p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gold hover:bg-gold/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Certificate Template
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-border bg-card">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-navy">No certificates yet</h3>
              <p className="text-muted-foreground mt-1">Create certificate templates for your courses</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                variant="outline" 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Certificate
              </Button>
            </div>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {cert.customTemplate ? (
                          <Image className="h-6 w-6 text-gold" />
                        ) : (
                          <Award className="h-6 w-6 text-gold" />
                        )}
                        <h3 className="font-serif text-xl font-bold text-navy">{cert.templateName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          cert.isActive 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {cert.isActive ? "Active" : "Inactive"}
                        </span>
                        {cert.customTemplate && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            Custom Template
                          </span>
                        )}
                        {cert.updatedAt && cert.updatedAt !== cert.createdAt && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Edited
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Course: {cert.courseTitle}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-gold" />
                          {cert.issueCount} certificates issued
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Created: {new Date(cert.createdAt).toLocaleDateString()}
                        </span>
                        {cert.updatedAt && cert.updatedAt !== cert.createdAt && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Edit className="h-3 w-3" />
                            Updated: {new Date(cert.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {cert.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                      {cert.customMessage && (
                        <p className="mt-1 text-xs text-muted-foreground italic">
                          "{cert.customMessage}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingCertificate(cert);
                        setShowEditModal(true);
                      }}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(cert)}>
                        <Eye className="h-3 w-3 mr-1" /> Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(cert.id)}>
                        {cert.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleIssueToAll(cert.id)}>
                        <Send className="h-3 w-3 mr-1" /> Issue to All
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteCertificate(cert.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Auto-issue on completion:</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <CertificateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCertificate}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
        />

        <CertificateModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditCertificate}
          editingCertificate={editingCertificate}
        />

        {showPreviewModal && previewCertificate && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute -top-12 right-0 z-10 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="text-sm font-medium">Close</span>
              </button>
              
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <CertificatePreview
                  courseName={previewCertificate.courseTitle}
                  courseDescription={previewCertificate.description}
                  completionDate={previewCertificate.completionDate ? new Date(previewCertificate.completionDate) : new Date()}
                  customMessage={previewCertificate.customMessage}
                  design={previewCertificate.design}
                  customTemplate={previewCertificate.customTemplate}
                />
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button className="bg-gold hover:bg-gold/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="bg-white" onClick={() => setShowPreviewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}