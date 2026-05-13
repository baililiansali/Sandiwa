import { useState, useEffect } from "react";
import { X, Save, Trash2, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotesManagerProps {
  courseId: string;
  lessonIndex: number;
  lessonTitle: string;
  onClose: () => void;
}

interface Note {
  id: string;
  lessonIndex: number;
  lessonTitle: string;
  text: string;
  timestamp: number;
  createdAt: string;
}

export function NotesManager({ courseId, lessonIndex, lessonTitle, onClose }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`sandiwa.notes.${courseId}`);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, [courseId]);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(`sandiwa.notes.${courseId}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const addNote = () => {
    if (!currentNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      lessonIndex,
      lessonTitle,
      text: currentNote,
      timestamp: Date.now(),
      createdAt: new Date().toLocaleDateString(),
    };

    saveNotes([...notes, newNote]);
    setCurrentNote("");
    toast.success("Note saved!");
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    toast.success("Note deleted");
  };

  const lessonNotes = notes.filter(n => n.lessonIndex === lessonIndex);
  const allNotes = notes;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-navy">My Notes</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Add Note for Current Lesson */}
          <div className="mb-6">
            <h4 className="font-semibold text-navy mb-2">Add Note for "{lessonTitle}"</h4>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Write your thoughts, insights, or questions..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button onClick={addNote} size="sm" className="bg-gold hover:bg-gold/90">
                <Save className="h-4 w-4 mr-1" /> Save Note
              </Button>
            </div>
          </div>

          {/* Current Lesson Notes */}
          {lessonNotes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-navy mb-2">Notes for This Lesson ({lessonNotes.length})</h4>
              <div className="space-y-3">
                {lessonNotes.map((note) => (
                  <div key={note.id} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm">{note.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                      <button onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Notes */}
          {allNotes.length > 0 && (
            <div>
              <h4 className="font-semibold text-navy mb-2">All Notes ({allNotes.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {allNotes.map((note) => (
                  <div key={note.id} className="border border-border rounded-lg p-3">
                    <p className="text-xs text-gold font-medium">{note.lessonTitle}</p>
                    <p className="text-sm mt-1">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{note.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}