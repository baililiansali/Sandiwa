import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Subtitles, Heart, Bookmark, NotebookPen, Maximize, Minimize } from "lucide-react";
import { SubtitleManager } from "./SubtitleManager";
import { EncyclopediaPopup } from "./EncyclopediaPopup";
import { NotesManager } from "./NotesManager";
import { BookmarkManager } from "./BookmarkManager";
import { toast } from "sonner";

// Define types
interface Lesson {
  title: string;
  minutes: number;
}

interface Course {
  id: string;
  title: string;
  image: string;
  lessons: Lesson[];
}

interface VideoPlayerProps {
  course: Course;
  currentLesson: number;
  onComplete: () => void;
  onProgressUpdate: (progress: number) => void;
}

interface SavedItem {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonIndex: number;
  lessonTitle: string;
  thumbnail: string;
  timestamp: number;
  note: string;
  savedAt: string;
  isOfflineAvailable: boolean;
}

interface EnrolledCourse {
  id: string;
  progress: number;
  title?: string;
  mentor?: string;
  image?: string;
  price?: number;
  enrolledAt?: string;
}

export function VideoPlayer({ course, currentLesson, onComplete, onProgressUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  const lesson = course.lessons[currentLesson];
  const lessonDuration = lesson.minutes * 60;

  // Load saved progress for this lesson
  useEffect(() => {
    const savedProgress = localStorage.getItem(`sandiwa.progress.${course.id}.lesson.${currentLesson}`);
    if (savedProgress) {
      const progress = parseFloat(savedProgress);
      setWatchedDuration(progress);
      if (videoRef.current) {
        videoRef.current.currentTime = progress;
      }
    }
    
    // Check if lesson was already completed
    const completedLessons: number[] = JSON.parse(localStorage.getItem(`sandiwa.completed.${course.id}`) || "[]");
    setIsLessonCompleted(completedLessons.includes(currentLesson));
    
    // Check if lesson is saved
    const saved = localStorage.getItem("sandiwa.savedContent");
    if (saved) {
      const savedItems: SavedItem[] = JSON.parse(saved);
      const exists = savedItems.some(
        (item: SavedItem) => item.courseId === course.id && item.lessonIndex === currentLesson
      );
      setIsSaved(exists);
    }
  }, [course.id, currentLesson]);

  // Save progress periodically
  const saveProgress = (time: number) => {
    localStorage.setItem(`sandiwa.progress.${course.id}.lesson.${currentLesson}`, time.toString());
    setWatchedDuration(time);
    
    // Calculate overall course progress
    const completedLessons: number[] = JSON.parse(localStorage.getItem(`sandiwa.completed.${course.id}`) || "[]");
    const completedCount = completedLessons.length;
    const currentProgress = (completedCount / course.lessons.length) * 100;
    onProgressUpdate(currentProgress);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      saveProgress(time);
      
      // Auto-mark as complete when reaching 90% of video
      const progress = time / lessonDuration;
      if (progress >= 0.9 && !isLessonCompleted) {
        markLessonComplete();
      }
    }
  };

  const markLessonComplete = () => {
    if (isLessonCompleted) return;
    
    setIsLessonCompleted(true);
    
    // Save completed lesson to localStorage
    const completedLessons: number[] = JSON.parse(localStorage.getItem(`sandiwa.completed.${course.id}`) || "[]");
    if (!completedLessons.includes(currentLesson)) {
      completedLessons.push(currentLesson);
      localStorage.setItem(`sandiwa.completed.${course.id}`, JSON.stringify(completedLessons));
      
      // Update overall course progress in enrolled courses
      const enrolled: EnrolledCourse[] = JSON.parse(localStorage.getItem("sandiwa.enrolled") || "[]");
      const courseIndex = enrolled.findIndex((c: EnrolledCourse) => c.id === course.id);
      if (courseIndex !== -1) {
        const newProgress = (completedLessons.length / course.lessons.length) * 100;
        enrolled[courseIndex].progress = Math.round(newProgress);
        localStorage.setItem("sandiwa.enrolled", JSON.stringify(enrolled));
      }
      
      toast.success(`🎉 Lesson completed! ${completedLessons.length}/${course.lessons.length} lessons done`);
      onComplete();
    }
  };

  const saveLesson = () => {
    const saved = localStorage.getItem("sandiwa.savedContent");
    const savedItems: SavedItem[] = saved ? JSON.parse(saved) : [];
    
    if (isSaved) {
      // Remove from saved
      const updated = savedItems.filter(
        (item: SavedItem) => !(item.courseId === course.id && item.lessonIndex === currentLesson)
      );
      localStorage.setItem("sandiwa.savedContent", JSON.stringify(updated));
      setIsSaved(false);
      toast.success(`Removed "${lesson.title}" from saved items`);
    } else {
      // Add to saved
      const newSavedItem: SavedItem = {
        id: `${course.id}-${currentLesson}-${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        lessonIndex: currentLesson,
        lessonTitle: lesson.title,
        thumbnail: course.image,
        timestamp: currentTime,
        note: "",
        savedAt: new Date().toISOString(),
        isOfflineAvailable: false,
      };
      savedItems.push(newSavedItem);
      localStorage.setItem("sandiwa.savedContent", JSON.stringify(savedItems));
      setIsSaved(true);
      toast.success(`"${lesson.title}" saved to your library`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWordClick = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedWord(selection.toString().trim());
      setShowEncyclopedia(true);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black aspect-video" onMouseUp={handleWordClick}>
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
        >
          <source src={`/videos/${course.id}/lesson-${currentLesson + 1}.mp4`} type="video/mp4" />
          {showSubtitles && (
            <track label="English" kind="subtitles" srcLang="en" src={`/subtitles/${course.id}/lesson-${currentLesson + 1}.vtt`} default />
          )}
        </video>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div 
              className="h-1 bg-white/30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gold rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full opacity-0 hover:opacity-100 transition" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full transition">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-white/20 rounded-full transition">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <SubtitleManager currentTime={currentTime} onLanguageChange={(lang) => console.log(lang)} />
              
              {/* Save Button*/}
              <button onClick={saveLesson} className="p-2 hover:bg-white/20 rounded-full transition" title={isSaved ? "Remove from saved" : "Save for later"}>
                {isSaved ? <Heart className="h-5 w-5 text-yellow-400 fill-yellow-400" /> : <Heart className="h-5 w-5" />}
              </button>
              
              {/* Bookmarks Button */}
              <button onClick={() => setShowBookmarks(!showBookmarks)} className="p-2 hover:bg-white/20 rounded-full transition" title="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </button>
              
              {/* Notes Button */}
              <button onClick={() => setShowNotes(!showNotes)} className="p-2 hover:bg-white/20 rounded-full transition" title="Notes">
                <NotebookPen className="h-5 w-5" />
              </button>
              
              {/* Fullscreen Button */}
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-full transition" title="Fullscreen">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info and Mark Complete Button */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">Lesson {currentLesson + 1}: {lesson.title}</h2>
            <p className="text-muted-foreground mt-1">{lesson.minutes} minutes • {currentLesson + 1} of {course.lessons.length}</p>
            {isSaved && (
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                <Heart className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Saved to your library
              </p>
            )}
          </div>
          
          {/* Mark as Complete Button */}
          <button
            onClick={markLessonComplete}
            disabled={isLessonCompleted}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              isLessonCompleted
                ? "bg-green-100 text-green-600 cursor-default"
                : "bg-gold text-gold-foreground hover:bg-gold/90"
            }`}
          >
            {isLessonCompleted ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lesson Completed
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Complete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Encyclopedia Popup */}
      {showEncyclopedia && (
        <EncyclopediaPopup word={selectedWord} onClose={() => setShowEncyclopedia(false)} />
      )}

      {/* Notes Modal */}
      {showNotes && (
        <NotesManager 
          courseId={course.id} 
          lessonIndex={currentLesson} 
          lessonTitle={lesson.title} 
          onClose={() => setShowNotes(false)} 
        />
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <BookmarkManager 
          courseId={course.id} 
          videoRef={videoRef as React.RefObject<HTMLVideoElement>} 
          onClose={() => setShowBookmarks(false)} 
        />
      )}
    </div>
  );
}