import { useState } from "react";
import { Globe, Check } from "lucide-react";

interface SubtitleManagerProps {
  currentTime: number;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "fil", name: "Filipino" },
  { code: "ceb", name: "Cebuano" },
  { code: "ilo", name: "Ilocano" },
];

export function SubtitleManager({ currentTime, onLanguageChange }: SubtitleManagerProps) {
  const [selectedLang, setSelectedLang] = useState("en");
  const [showMenu, setShowMenu] = useState(false);

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    onLanguageChange(code);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)} 
        className="flex items-center gap-2 text-sm hover:text-gold transition p-2 rounded-full hover:bg-white/20"
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">{languages.find(l => l.code === selectedLang)?.name}</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full mb-2 right-0 bg-card border border-border text-black rounded-lg shadow-lg p-2 z-20 min-w-[140px]">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between gap-3 w-full px-3 py-2 text-sm hover:bg-gold/10 rounded-md transition"
            >
              {lang.name}
              {selectedLang === lang.code && <Check className="h-4 w-4 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}