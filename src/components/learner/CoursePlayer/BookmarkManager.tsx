// src/components/learner/CoursePlayer/BookmarkManager.tsx
import { useState, useEffect, useRef } from "react";
import { X, Bookmark, BookmarkCheck, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookmarkManagerProps {
  courseId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onClose: () => void;
}

interface Bookmark {
  id: string;
  lessonIndex: number;
  lessonTitle: string;
  timestamp: number;
  note?: string;
  createdAt: string;
}

export function BookmarkManager({ courseId, videoRef, onClose }: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`sandiwa.bookmarks.${courseId}`);
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
    
    // Get current lesson info from URL or state
    const path = window.location.pathname;
    const match = path.match(/\/learn\/(.+)/);
    // This would need to be passed from parent component
  }, [courseId]);

  const saveBookmarks = (updated: Bookmark[]) => {
    localStorage.setItem(`sandiwa.bookmarks.${courseId}`, JSON.stringify(updated));
    setBookmarks(updated);
  };

  const addBookmark = () => {
    if (!videoRef.current) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      lessonIndex: currentLesson,
      lessonTitle: currentLessonTitle || "Current Lesson",
      timestamp: videoRef.current.currentTime,
      note: currentNote || undefined,
      createdAt: new Date().toLocaleDateString(),
    };

    saveBookmarks([...bookmarks, newBookmark]);
    setCurrentNote("");
    toast.success("Bookmark saved at " + formatTime(newBookmark.timestamp));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
    toast.success("Bookmark removed");
  };

  const seekTo = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-navy">Bookmarks</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Add Bookmark */}
          <div className="mb-6">
            <Button onClick={addBookmark} className="w-full bg-gold hover:bg-gold/90">
              <BookmarkCheck className="h-4 w-4 mr-2" /> Bookmark Current Time
            </Button>
            <input
              type="text"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Bookmarks List */}
          {bookmarks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No bookmarks yet. Save important moments!</p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <button onClick={() => seekTo(bookmark.timestamp)} className="flex items-center gap-2 text-gold hover:underline">
                      <Play className="h-4 w-4" />
                      <span className="font-medium">{formatTime(bookmark.timestamp)}</span>
                    </button>
                    <button onClick={() => deleteBookmark(bookmark.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {bookmark.note && <p className="text-sm text-muted-foreground mt-2">{bookmark.note}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Saved on {bookmark.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}