import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Upload, X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { courses, type Course } from "@/data/mockCourses";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";

export const Route = createFileRoute("/mentor/courses/edit/$courseId")({
  component: EditCoursePage,
});

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
}

function EditCoursePage() {
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalCourse, setOriginalCourse] = useState<Course | null>(null);
  
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    level: "beginner",
    price: "",
    description: "",
    whatYouWillLearn: [] as string[],
    requirements: [] as string[],
  });
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLearningPoint, setNewLearningPoint] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  const categories = [
    "Filipino Language",
    "Philippine History",
    "Arts & Crafts",
    "Music & Dance",
    "Cuisine",
    "Cultural Heritage",
    "Literature",
  ];

  const levels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  // Load actual course data from mock data
  useEffect(() => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setOriginalCourse(course);
      setCourseData({
        title: course.title,
        category: course.category,
        level: "beginner",
        price: course.price.toString(),
        description: course.description,
        whatYouWillLearn: course.outcomes,
        requirements: [
          "No prior knowledge needed",
          "Willingness to practice",
          "Access to a device with internet"
        ],
      });
      setLessons(course.lessons.map((lesson, index) => ({
        id: index + 1,
        title: lesson.title,
        description: `Learn ${lesson.title.toLowerCase()} in this comprehensive lesson`,
        duration: `${lesson.minutes} min`,
      })));
      setExistingImage(course.image);
    }
    setIsLoading(false);
  }, [courseId]);

  const addLesson = () => {
    setLessons([...lessons, { id: Date.now(), title: "", description: "", duration: "" }]);
  };

  const removeLesson = (id: number) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const updateLesson = (id: number, field: keyof Lesson, value: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const addLearningPoint = () => {
    if (newLearningPoint.trim()) {
      setCourseData({
        ...courseData,
        whatYouWillLearn: [...courseData.whatYouWillLearn, newLearningPoint.trim()]
      });
      setNewLearningPoint("");
    }
  };

  const removeLearningPoint = (index: number) => {
    setCourseData({
      ...courseData,
      whatYouWillLearn: courseData.whatYouWillLearn.filter((_, i) => i !== index)
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setCourseData({
        ...courseData,
        requirements: [...courseData.requirements, newRequirement.trim()]
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setCourseData({
      ...courseData,
      requirements: courseData.requirements.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseData.title || !courseData.category || !courseData.price || !courseData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (lessons.some(l => !l.title || !l.duration)) {
      toast.error("Please complete all lesson information");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would save to localStorage or API here
      // For now, just show success and redirect
      toast.success("Course updated successfully!");
      setIsSubmitting(false);
      navigate({ to: "/mentor/courses" });
    }, 1000);
  };

  if (isLoading) {
    return (
      <MentorDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading course data...</p>
          </div>
        </div>
      </MentorDashboardLayout>
    );
  }

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-gold mb-4">Basic Information</h2>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g., Filipino Language for Beginners"
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    required
                    value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Level *</label>
                  <select
                    value={courseData.level}
                    onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {levels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Price (₱) *</label>
                <input
                  type="number"
                  required
                  value={courseData.price}
                  onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Course Description *</label>
                <textarea
                  required
                  rows={4}
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Describe what students will learn..."
                />
              </div>

              {/* Course Image Upload */}
              <div>
                <label className="text-sm font-medium">Course Image</label>
                {existingImage && !courseImage && (
                  <div className="mt-2 mb-2">
                    <img src={existingImage} alt="Current course image" className="h-32 w-48 object-cover rounded-lg" />
                    <p className="text-xs text-muted-foreground mt-1">Current image</p>
                  </div>
                )}
                <div className="mt-1.5 rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-gold transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {courseImage ? courseImage.name : "Upload a new cover image (optional)"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCourseImage(e.target.files?.[0] || null)}
                    className="mt-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold-foreground hover:file:bg-gold/90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-gold mb-4">What Students Will Learn</h2>
            <div className="space-y-3">
              {courseData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{item}</span>
                  <button type="button" onClick={() => removeLearningPoint(index)} className="text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearningPoint}
                  onChange={(e) => setNewLearningPoint(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLearningPoint()}
                  placeholder="Add a learning outcome..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <Button type="button" size="sm" onClick={addLearningPoint}>Add</Button>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-gold mb-4">Requirements</h2>
            <div className="space-y-3">
              {courseData.requirements.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{item}</span>
                  <button type="button" onClick={() => removeRequirement(index)} className="text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  placeholder="Add a requirement..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <Button type="button" size="sm" onClick={addRequirement}>Add</Button>
              </div>
            </div>
          </div>

          {/* Course Content / Lessons */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-navy dark:text-gold">Course Content</h2>
              <Button type="button" size="sm" onClick={addLesson}>
                <Plus className="h-4 w-4 mr-1" /> Add Lesson
              </Button>
            </div>
            
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-navy dark:text-gold">Lesson {index + 1}</h3>
                    {lessons.length > 1 && (
                      <button type="button" onClick={() => removeLesson(lesson.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <textarea
                      placeholder="Lesson Description"
                      value={lesson.description}
                      onChange={(e) => updateLesson(lesson.id, "description", e.target.value)}
                      rows={2}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 15 min)"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" size="lg" className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MentorDashboardLayout>
  );
}

