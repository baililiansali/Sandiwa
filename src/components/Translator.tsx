import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Globe, X } from "lucide-react";

const dictionary: Record<string, Record<string, string>> = {
  fil: {
    hello: "kamusta",
    "thank you": "salamat",
    "good morning": "magandang umaga",
    friend: "kaibigan",
    love: "pag-ibig",
    family: "pamilya",
    food: "pagkain",
    water: "tubig",
    yes: "oo",
    no: "hindi",
    goodbye: "paalam",
    "how are you": "kamusta ka",
    "what is your name": "ano ang pangalan mo",
    "my name is": "ang pangalan ko ay",
    "i love you": "mahal kita",
    welcome: "maligayang pagdating",
    "good afternoon": "magandang hapon",
    "good evening": "magandang gabi",
  },
  ceb: {
    hello: "kumusta",
    "thank you": "salamat",
    "good morning": "maayong buntag",
    friend: "higala",
    love: "gugma",
    family: "pamilya",
    food: "pagkaon",
    water: "tubig",
    yes: "oo",
    no: "dili",
    goodbye: "paalam",
    "how are you": "kumusta ka",
    "what is your name": "unsa imong ngalan",
    "my name is": "akong ngalan kay",
    "i love you": "gihagugma tika",
    welcome: "maayong pag-abot",
    "good afternoon": "maayong hapon",
    "good evening": "maayong gabii",
  },
  ilo: {
    hello: "kumusta",
    "thank you": "agyamanak",
    "good morning": "naimbag a bigat",
    friend: "gayyem",
    love: "ayat",
    family: "pamilia",
    food: "kanen",
    water: "danum",
    yes: "wen",
    no: "saan",
    goodbye: "agpakadaakon",
    "how are you": "kumusta kan",
    "what is your name": "ania ti nagan mo",
    "my name is": "ti nagan ko ket",
    "i love you": "ayat-ayaten ka",
    welcome: "naragsak nga isasangbay",
    "good afternoon": "naimbag a malem",
    "good evening": "naimbag a rabii",
  },
};

interface TranslatorProps {
  variant?: "dropdown" | "modal" | "inline";
}

export function Translator({ variant = "dropdown" }: TranslatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("fil");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const langs = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fil", label: "Filipino", flag: "🇵🇭" },
    { code: "ceb", label: "Cebuano", flag: "🇵🇭" },
    { code: "ilo", label: "Ilocano", flag: "🇵🇭" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const translate = () => {
    const text = input.trim().toLowerCase();
    if (!text) {
      setOutput("");
      return;
    }
    if (to === "en") {
      const dict = dictionary[from];
      if (!dict) {
        setOutput(input);
        return;
      }
      const reverse = Object.entries(dict).find(([, v]) => v === text);
      setOutput(reverse ? reverse[0] : `[${input}]`);
      return;
    }
    const dict = dictionary[to];
    setOutput(dict?.[text] ?? `[${input}]`);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setInput(output);
    setOutput(input);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const currentLang = langs.find(l => l.code === to) || langs[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
      >
        <Globe className="h-4 w-4 text-gold" />
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="border-b border-border px-4 py-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-navy">Language Translator</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Translate words & phrases</p>
          </div>

          {/* Language Selectors */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {langs.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
              <button
                onClick={swap}
                className="rounded-md p-2 hover:bg-accent transition-colors text-gold"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {langs.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation Area */}
          <div className="p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a word or phrase..."
              className="w-full rounded-md border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold"
              rows={2}
            />
            <div className="mt-2 flex justify-end gap-2">
              {input && (
                <Button
                  onClick={clear}
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground"
                >
                  Clear
                </Button>
              )}
              <Button
                onClick={translate}
                size="sm"
                className="bg-gold hover:bg-gold/90 text-gold-foreground"
              >
                Translate
              </Button>
            </div>
            {output && (
              <div className="mt-3 rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Translation:</p>
                <p className="text-sm font-medium text-navy">{output}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}