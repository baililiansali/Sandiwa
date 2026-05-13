import { Button } from "@/components/ui/button";
import { X, Video, Upload, FileVideo, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface AddLessonModalProps {
  onClose: () => void;
  onAdd: (lesson: { title: string; minutes: number; videoUrl?: string; videoFile?: File }) => void;
  editingLesson?: {
    id: string;
    title: string;
    duration: number;
    videoUrl?: string;
    videoFile?: File;
    videoPreview?: string;
  } | null;
}

export function AddLessonModal({ onClose, onAdd, editingLesson }: AddLessonModalProps) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (editingLesson) {
      setTitle(editingLesson.title);
      setMinutes(editingLesson.duration.toString());
      if (editingLesson.videoUrl) {
        setUploadMethod("url");
        setVideoUrl(editingLesson.videoUrl);
      } else if (editingLesson.videoPreview) {
        setUploadMethod("file");
        setVideoPreview(editingLesson.videoPreview);
        // Note: We can't restore the File object, but we can show the preview
        setVideoFile(null); // File object is lost on edit, but preview remains
      }
    }
  }, [editingLesson]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is video
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Video file size should be less than 500MB");
        return;
      }
      
      setVideoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setVideoUrl("");
      toast.success(`Video "${file.name}" selected`);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview && !editingLesson?.videoPreview) {
      // Only revoke if it's a new preview (not from editing)
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setVideoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }
    
    if (!minutes.trim() || isNaN(parseInt(minutes)) || parseInt(minutes) <= 0) {
      toast.error("Please enter a valid duration in minutes");
      return;
    }

    if (uploadMethod === "url" && !videoUrl.trim()) {
      toast.error("Please enter a video URL or switch to file upload");
      return;
    }

    if (uploadMethod === "file" && !videoFile && !videoPreview) {
      toast.error("Please select a video file or switch to URL upload");
      return;
    }

    onAdd({
      title: title.trim(),
      minutes: parseInt(minutes),
      videoUrl: uploadMethod === "url" ? videoUrl : undefined,
      videoFile: uploadMethod === "file" && videoFile ? videoFile : undefined,
    });
    
    // Cleanup new preview only (not editing preview)
    if (videoPreview && !editingLesson?.videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    
    setTitle("");
    setMinutes("");
    setVideoUrl("");
    setVideoFile(null);
    setVideoPreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-navy">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </h2>
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Lesson Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Introduction to Filipino"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Duration (in minutes) *
              </label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., 15"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Video Attachment
              </label>
              
              {/* Upload Method Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod("url");
                    if (editingLesson && editingLesson.videoPreview) {
                      // Don't remove existing preview when switching methods during edit
                      if (!videoPreview?.startsWith('blob:')) {
                        handleRemoveVideo();
                      }
                    } else {
                      handleRemoveVideo();
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    uploadMethod === "url"
                      ? "bg-gold text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Video URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod("file");
                    if (editingLesson && editingLesson.videoUrl) {
                      // Clear URL when switching to file
                      setVideoUrl("");
                    } else if (!editingLesson?.videoPreview) {
                      handleRemoveVideo();
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    uploadMethod === "file"
                      ? "bg-gold text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {uploadMethod === "url" && (
                <div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Support: YouTube, Vimeo, or direct video URLs
                  </p>
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === "file" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  {!videoFile && !videoPreview ? (
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-gold transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload video</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI, MKV (Max 500MB)</p>
                    </label>
                  ) : (
                    <div className="p-3 border border-border rounded-md bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FileVideo className="h-5 w-5 text-gold" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {videoFile ? videoFile.name : editingLesson?.title}
                            </p>
                            {videoFile && (
                              <p className="text-xs text-muted-foreground">
                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveVideo}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      {videoPreview && (
                        <video
                          src={videoPreview}
                          controls
                          className="mt-3 w-full rounded-md max-h-32"
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Video Preview for URL */}
              {uploadMethod === "url" && videoUrl && (
                <div className="mt-2 p-2 bg-muted/20 rounded-md">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Video className="h-3 w-3" />
                    <span>Video URL added: {videoUrl.substring(0, 50)}...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gold hover:bg-gold/90 text-white"
              >
                {editingLesson ? "Update Lesson" : "Add Lesson"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}