import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { courses } from "@/data/mockCourses";

export const Route = createFileRoute("/mentor/courses/create")({
  head: () => ({
    meta: [
      { title: "Create Course — Sandiwa Mentor" },
      { name: "description", content: "Create a new course." },
    ],
  }),
  component: CreateCoursePage,
});

type CourseCategory = "Filipino Language" | "Heritage" | "Cuisine" | "Music & Dance" | "History" | "Arts & Crafts";

interface Lesson {
  title: string;
  minutes: number;
}

function CreateCoursePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Filipino Language" as CourseCategory,
    image: "",
    tags: [] as string[],
    hours: "",
    outcomes: "",
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({ title: "", minutes: "" });
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  const categories: CourseCategory[] = ["Filipino Language", "Heritage", "Cuisine", "Music & Dance", "History", "Arts & Crafts"];

  const handleAddTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, currentTag.trim()]
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddLesson = () => {
    if (!newLesson.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }
    if (!newLesson.minutes.trim() || isNaN(parseInt(newLesson.minutes))) {
      toast.error("Please enter a valid duration in minutes");
      return;
    }

    setLessons([...lessons, {
      title: newLesson.title,
      minutes: parseInt(newLesson.minutes)
    }]);
    
    setNewLesson({ title: "", minutes: "" });
    setShowLessonForm(false);
    toast.success("Lesson added successfully!");
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!courseData.title.trim()) {
      toast.error("Please enter a course title");
      return;
    }
    
    if (!courseData.description.trim()) {
      toast.error("Please enter a course description");
      return;
    }
    
    if (!courseData.price.trim() || isNaN(parseFloat(courseData.price))) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!courseData.hours.trim() || isNaN(parseFloat(courseData.hours))) {
      toast.error("Please enter valid total hours");
      return;
    }

    if (!courseData.outcomes.trim()) {
      toast.error("Please enter learning outcomes");
      return;
    }

    if (lessons.length === 0) {
      toast.error("Please add at least one lesson");
      return;
    }

    setIsSubmitting(true);

    // Get mentor email from localStorage
    const mentorEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    
    // Calculate total hours from lessons (sum of all lesson minutes / 60)
    const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
    const calculatedHours = parseFloat((totalMinutes / 60).toFixed(1));

    // Create new course object matching the Course type
    const newCourse = {
      id: `course_${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      price: parseFloat(courseData.price),
      mentorId: "mentor_001", // You might want to get this from auth
      mentor: "Current Mentor", // You might want to get this from auth
      mentorEmail: mentorEmail,
      image: courseData.image || "/placeholder-course.jpg",
      category: courseData.category,
      tags: courseData.tags,
      lessons: lessons,
      enrolled: 0,
      rating: 0,
      hours: parseFloat(courseData.hours) || calculatedHours,
      outcomes: courseData.outcomes.split('\n').filter(outcome => outcome.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock courses data (in real app, this would be an API call)
    courses.push(newCourse);

    toast.success("Course created successfully!");
    
    setTimeout(() => {
      navigate({ to: "/mentor/courses" });
    }, 500);
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
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <h1 className="font-serif text-3xl font-bold text-navy">Create New Course</h1>
          <p className="mt-2 text-muted-foreground">
            Share your expertise by creating a new course. Fill out the details below.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-navy mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    placeholder="e.g., Complete Filipino Language Course"
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {courseData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Category *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value as CourseCategory })}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Course Description *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    placeholder="Describe what students will learn in this course..."
                    rows={5}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={1000}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {courseData.description.length}/1000 characters
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Learning Outcomes *
                  </label>
                  <textarea
                    value={courseData.outcomes}
                    onChange={(e) => setCourseData({ ...courseData, outcomes: e.target.value })}
                    placeholder="Enter each learning outcome on a new line&#10;e.g.,&#10;Understand basic Filipino grammar rules&#10;Conduct everyday conversations&#10;Master common Filipino phrases"
                    rows={4}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter each outcome on a new line
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy">
                      Total Hours *
                    </label>
                    <input
                      type="number"
                      value={courseData.hours}
                      onChange={(e) => setCourseData({ ...courseData, hours: e.target.value })}
                      placeholder="e.g., 5.5"
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      min="0"
                      step="0.5"
                      required
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Total course duration in hours
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy">
                      Price (₱) *
                    </label>
                    <input
                      type="number"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                      placeholder="e.g., 880"
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Course Image URL
                  </label>
                  <input
                    type="url"
                    value={courseData.image}
                    onChange={(e) => setCourseData({ ...courseData, image: e.target.value })}
                    placeholder="https://example.com/course-image.jpg"
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leave empty to use default placeholder image
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="e.g., Beginner, Grammar, Vocabulary"
                      className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add Tag
                    </Button>
                  </div>
                  {courseData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gold/10 text-gold rounded-md">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Content / Lessons */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">Course Lessons *</h2>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowLessonForm(true)}
                >
                  + Add Lesson
                </Button>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-8 rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-sm text-muted-foreground">No lessons added yet. Click "Add Lesson" to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-medium text-muted-foreground w-8">{index + 1}</span>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.minutes} minutes</p>
                        </div>
                      </div>
                      <Button 
                        type="button"
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRemoveLesson(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Add Lesson Modal */}
        {showLessonForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-navy">Add New Lesson</h2>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowLessonForm(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="e.g., Introduction to Filipino"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      Duration (in minutes) *
                    </label>
                    <input
                      type="number"
                      value={newLesson.minutes}
                      onChange={(e) => setNewLesson({ ...newLesson, minutes: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="e.g., 15"
                      min="1"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setShowLessonForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleAddLesson}
                      className="flex-1 bg-gold hover:bg-gold/90 text-white"
                    >
                      Add Lesson
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}