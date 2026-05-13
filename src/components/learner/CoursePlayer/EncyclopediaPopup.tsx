import { Link } from "@tanstack/react-router";
import { X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EncyclopediaPopupProps {
  word: string;
  onClose: () => void;
}

// Mock encyclopedia data - can be expanded
const wordDefinitions: Record<string, { definition: string; articleId: string }> = {
  "baybayin": {
    definition: "Traditional script of the Philippines used before Spanish colonization. It is a syllabic writing system that is experiencing a cultural revival.",
    articleId: "baybayin-script"
  },
  "adobo": {
    definition: "A popular Filipino dish made with meat (usually chicken or pork) marinated in vinegar, soy sauce, garlic, and spices.",
    articleId: "filipino-cuisine-basics"
  },
  "tinikling": {
    definition: "Traditional Filipino dance that uses bamboo poles. Dancers skillfully step over and between the poles as they are tapped together.",
    articleId: "filipino-folk-dance"
  },
  "bayanihan": {
    definition: "Filipino spirit of communal unity and cooperation. Traditionally refers to neighbors helping a family move their house.",
    articleId: "understanding-bayanihan"
  },
  "salamat": {
    definition: "The Filipino word for 'thank you'. It's one of the most important polite expressions in the language.",
    articleId: "common-filipino-phrases"
  },
  "kamusta": {
    definition: "The Filipino word for 'hello' or 'how are you?'. It's derived from the Spanish 'cómo está'.",
    articleId: "common-filipino-phrases"
  },
};

export function EncyclopediaPopup({ word, onClose }: EncyclopediaPopupProps) {
  const definition = wordDefinitions[word.toLowerCase()];
  const lowerWord = word.toLowerCase();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-navy">Culture Encyclopedia</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <h4 className="font-semibold text-gold mb-2 break-words">{word}</h4>
          
          {definition ? (
            <>
              <p className="text-muted-foreground">{definition.definition}</p>
              <Link
                to="/learner/encyclopedia/$articleId"
                params={{ articleId: definition.articleId }}
                onClick={onClose}
                className="inline-flex items-center gap-1 mt-4 text-sm text-gold hover:underline"
              >
                Read full article →
              </Link>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">No encyclopedia entry found for "{word}".</p>
              <p className="text-sm text-muted-foreground mt-2">Would you like to suggest an addition?</p>
              <Button size="sm" className="mt-3 bg-gold hover:bg-gold/90">
                Suggest Definition
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}