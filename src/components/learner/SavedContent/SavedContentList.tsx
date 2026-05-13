import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Download, Trash2, Play, FileText, Clock, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SavedItem {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonIndex: number;
  lessonTitle: string;
  thumbnail: string;
  timestamp?: number;
  note?: string;
  savedAt: string;
  isOfflineAvailable: boolean;
}

export function SavedContentList() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [offlineItems, setOfflineItems] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sandiwa.savedContent");
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
    
    const offline = localStorage.getItem("sandiwa.offlineContent");
    if (offline) {
      setOfflineItems(JSON.parse(offline));
    }
  }, []);

  const saveToLocalStorage = (items: SavedItem[]) => {
    localStorage.setItem("sandiwa.savedContent", JSON.stringify(items));
    setSavedItems(items);
  };

  const saveOfflineItems = (items: string[]) => {
    localStorage.setItem("sandiwa.offlineContent", JSON.stringify(items));
    setOfflineItems(items);
  };

  const removeSavedItem = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    saveToLocalStorage(updated);
    toast.success("Removed from saved items");
  };

  const downloadForOffline = async (item: SavedItem) => {
    setIsDownloading(item.id);
    
    // Simulate download (in real app, this would download video/notes)
    setTimeout(() => {
      const updatedOffline = [...offlineItems, item.id];
      saveOfflineItems(updatedOffline);
      setIsDownloading(null);
      toast.success(`"${item.lessonTitle}" saved for offline access`);
    }, 1500);
  };

  const removeOffline = (id: string) => {
    const updated = offlineItems.filter(itemId => itemId !== id);
    saveOfflineItems(updated);
    toast.success("Removed from offline storage");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOfflineAvailable = (id: string) => offlineItems.includes(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Saved Content</h2>
          <p className="text-sm text-muted-foreground">Lessons you've saved for later or offline access</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {savedItems.length} saved • {offlineItems.length} offline
          </span>
        </div>
      </div>

      {/* Saved Items Grid */}
      {savedItems.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-card">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No saved content yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click the bookmark icon on any lesson to save it here</p>
          <Button asChild className="mt-4 bg-gold hover:bg-gold/90">
            <Link to="/learner/courses/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-48 h-32 bg-muted relative">
                  <img src={item.thumbnail} alt={item.lessonTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <Link to="/learner/learn/$courseId" params={{ courseId: item.courseId }}>
                      <Button size="sm" className="bg-gold hover:bg-gold/90">
                        <Play className="h-4 w-4 mr-1" /> Watch
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gold font-medium">{item.courseTitle}</p>
                      <h3 className="font-semibold text-navy mt-1">{item.lessonTitle}</h3>
                      {item.note && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          <span className="font-medium">Note:</span> {item.note}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Saved {formatDate(item.savedAt)}</span>
                        {item.timestamp && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Bookmark at {Math.floor(item.timestamp / 60)}:{Math.floor(item.timestamp % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isOfflineAvailable(item.id) ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                          <CheckCircle className="h-3 w-3" />
                          <span>Offline</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => downloadForOffline(item)}
                          disabled={isDownloading === item.id}
                          className="p-2 text-muted-foreground hover:text-gold transition"
                          title="Save for offline"
                        >
                          {isDownloading === item.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => removeSavedItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 transition"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offline Storage Info */}
      {offlineItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
            <Download className="h-4 w-4 text-gold" />
            Available Offline ({offlineItems.length} items)
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedItems
              .filter(item => offlineItems.includes(item.id))
              .map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                  <span className="text-sm">{item.lessonTitle}</span>
                  <button onClick={() => removeOffline(item.id)} className="text-muted-foreground hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Offline content is stored in your browser. You can access it without internet connection.
          </p>
        </div>
      )}
    </div>
  );
}