// components/CourseLessonManager.tsx
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
}

interface CourseLessonManagerProps {
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

export function CourseLessonManager({ lessons, onLessonsChange }: CourseLessonManagerProps) {
  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now(),
      title: "",
      description: "",
      duration: "",
    };
    onLessonsChange([...lessons, newLesson]);
  };

  const removeLesson = (id: number) => {
    onLessonsChange(lessons.filter(l => l.id !== id));
  };

  const updateLesson = (id: number, field: keyof Lesson, value: string) => {
    onLessonsChange(
      lessons.map(l => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-gold">Course Content</h2>
        <Button type="button" size="sm" onClick={addLesson} className="bg-gold hover:bg-gold/90">
          <Plus className="h-4 w-4 mr-1" /> Add Lesson
        </Button>
      </div>

      <div className="space-y-4">
        {lessons.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No lessons yet. Click "Add Lesson" to get started.</p>
          </div>
        )}
        
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy dark:text-gold">Lesson {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeLesson(lesson.id)}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
  );
}