import { Button } from "@/components/ui/button";
import { Award, Upload, X, Image, Link as LinkIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { courses } from "@/data/mockCourses";

export interface CertificateFormData {
  templateName: string;
  design: string;
  customMessage: string;
  description: string;
  completionDate: string;
  templateType: "builtin" | "image" | "url";
  customImage: File | null;
  customImagePreview: string;
  customUrl: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormData) => void;
  editingCertificate?: {
    id: string;
    templateName: string;
    design: string;
    customMessage?: string;
    description?: string;
    completionDate?: string;
    customTemplate?: {
      type: "image" | "url";
      value: string;
      preview?: string;
    };
  } | null;
  selectedCourse?: string;
  onCourseChange?: (courseId: string) => void;
}

export function CertificateModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingCertificate,
  selectedCourse = "",
  onCourseChange 
}: CertificateModalProps) {
  const [formData, setFormData] = useState<CertificateFormData>(() => {
    if (editingCertificate) {
      return {
        templateName: editingCertificate.templateName,
        design: editingCertificate.design,
        customMessage: editingCertificate.customMessage || "",
        description: editingCertificate.description || "",
        completionDate: editingCertificate.completionDate || new Date().toISOString().split('T')[0],
        templateType: editingCertificate.customTemplate ? "image" : "builtin",
        customImage: null,
        customImagePreview: editingCertificate.customTemplate?.preview || "",
        customUrl: editingCertificate.customTemplate?.type === "url" ? editingCertificate.customTemplate.value : "",
      };
    }
    return {
      templateName: "",
      design: "modern",
      customMessage: "",
      description: "",
      completionDate: new Date().toISOString().split('T')[0],
      templateType: "builtin",
      customImage: null,
      customImagePreview: "",
      customUrl: ""
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, etc.)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should be less than 5MB");
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        customImage: file,
        customImagePreview: previewUrl,
        customUrl: ""
      });
      toast.success("Certificate template image uploaded!");
    }
  };

  const handleRemoveImage = () => {
    if (formData.customImagePreview) {
      URL.revokeObjectURL(formData.customImagePreview);
    }
    setFormData({
      ...formData,
      customImage: null,
      customImagePreview: "",
      customUrl: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!formData.description) {
      toast.error("Please enter a course description");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-navy">
              {editingCertificate ? "Edit Certificate Template" : "Create Certificate Template"}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {!editingCertificate && (
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Select Course *
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => onCourseChange?.(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Certificate Name *
              </label>
              <input
                type="text"
                value={formData.templateName}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Completion Certificate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Course Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Describe what the student learned in this course..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                This description will appear on the certificate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Certificate Date *
              </label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The date that will appear on the certificate
              </p>
            </div>

            {!editingCertificate && (
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Template Source *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, templateType: "builtin", customImage: null, customImagePreview: "", customUrl: "" })}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.templateType === "builtin" 
                        ? "border-gold bg-gold/10 ring-2 ring-gold/50" 
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <Award className="h-8 w-8 mx-auto mb-2 text-gold" />
                    <span className="text-sm font-medium">Built-in Template</span>
                    <p className="text-xs text-muted-foreground mt-1">Use Sandiwa's design</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, templateType: "image", customUrl: "" })}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.templateType === "image" 
                        ? "border-gold bg-gold/10 ring-2 ring-gold/50" 
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gold" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG (Max 5MB)</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, templateType: "url", customImage: null, customImagePreview: "" })}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.templateType === "url" 
                        ? "border-gold bg-gold/10 ring-2 ring-gold/50" 
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <LinkIcon className="h-8 w-8 mx-auto mb-2 text-gold" />
                    <span className="text-sm font-medium">Use URL</span>
                    <p className="text-xs text-muted-foreground mt-1">Link to template</p>
                  </button>
                </div>
              </div>
            )}

            {formData.templateType === "builtin" && (
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Design Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, design: "modern" })}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.design === "modern" 
                        ? "border-gold bg-gold/10 ring-2 ring-gold/50" 
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                    <span className="text-sm">Modern</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, design: "classic" })}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.design === "classic" 
                        ? "border-gold bg-gold/10 ring-2 ring-gold/50" 
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <div className="h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded mb-2"></div>
                    <span className="text-sm">Classic</span>
                  </button>
                </div>
              </div>
            )}

            {formData.templateType === "image" && (
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Upload Certificate Template *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="template-upload"
                />
                {!formData.customImagePreview ? (
                  <label
                    htmlFor="template-upload"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold transition-colors"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Click to upload your certificate template</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports PNG, JPG (Max 5MB)
                    </p>
                    <p className="text-xs text-gold mt-2">
                      Tip: Design in Canva, then export as PNG/JPG
                    </p>
                  </label>
                ) : (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Image className="h-5 w-5 text-gold" />
                        <span className="text-sm font-medium">Template Uploaded</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                    <img 
                      src={formData.customImagePreview} 
                      alt="Template preview" 
                      className="w-full h-auto rounded-lg border max-h-48 object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Student name, course details, and date will be overlaid on this template
                    </p>
                  </div>
                )}
              </div>
            )}

            {formData.templateType === "url" && (
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Template URL *
                </label>
                <input
                  type="url"
                  value={formData.customUrl}
                  onChange={(e) => setFormData({ ...formData, customUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="https://example.com/certificate-template.jpg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter a URL to your certificate template
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Custom Message (Optional)
              </label>
              <textarea
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Add a personal message to the certificate..."
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ How it works:</strong> Certificates will be automatically issued to students when they complete all lessons in this course.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-gold hover:bg-gold/90 text-white"
              >
                {editingCertificate ? "Save Changes" : "Create Template"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}