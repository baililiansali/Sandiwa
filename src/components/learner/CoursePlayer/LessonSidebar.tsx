import { CheckCircle, Play, Lock } from "lucide-react";

interface LessonSidebarProps {
  course: {
    lessons: Array<{ title: string; minutes: number }>;
  };
  currentLesson: number;
  completedLessons: number[];
  onSelectLesson: (index: number) => void;
}

export function LessonSidebar({ course, currentLesson, completedLessons, onSelectLesson }: LessonSidebarProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden sticky top-24">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-navy">Course Content</h3>
        <p className="text-xs text-muted-foreground">{course.lessons.length} lessons</p>
      </div>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        {course.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(index);
          const isCurrent = currentLesson === index;
          
          return (
            <button
              key={index}
              onClick={() => onSelectLesson(index)}
              className={`w-full text-left p-4 transition-colors ${
                isCurrent ? "bg-gold/5 border-l-2 border-l-gold" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isCurrent ? (
                    <Play className="h-5 w-5 text-gold" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${isCurrent ? "text-gold" : "text-navy"}`}>
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{lesson.minutes} min</p>
                  </div>
                </div>
                {isCompleted && (
                  <span className="text-xs text-green-600">Completed</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}