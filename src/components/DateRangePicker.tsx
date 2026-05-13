import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onPresetChange?: (preset: string) => void;
}

const PRESETS = [
  { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
  { label: "Yesterday", getRange: () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { from: yesterday, to: yesterday };
  }},
  { label: "Last 7 Days", getRange: () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from, to };
  }},
  { label: "Last 30 Days", getRange: () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return { from, to };
  }},
  { label: "This Month", getRange: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from, to };
  }},
  { label: "Last Month", getRange: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from, to };
  }},
  { label: "This Year", getRange: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), 0, 1);
    const to = new Date(now.getFullYear(), 11, 31);
    return { from, to };
  }},
  { label: "Last Year", getRange: () => {
    const now = new Date();
    const from = new Date(now.getFullYear() - 1, 0, 1);
    const to = new Date(now.getFullYear() - 1, 11, 31);
    return { from, to };
  }},
];

// Generate years from 2000 to current year
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, i) => 2000 + i);

export function DateRangePicker({ value, onChange, onPresetChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());
  const [viewYear, setViewYear] = useState(viewMonth.getFullYear());
  const [tempFrom, setTempFrom] = useState<Date | null>(value.from);
  const [tempTo, setTempTo] = useState<Date | null>(value.to);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const yearSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearSelector(false);
      }
      if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target as Node)) {
        setShowYearSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync viewYear with viewMonth
  useEffect(() => {
    setViewYear(viewMonth.getFullYear());
  }, [viewMonth]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewYear, viewMonth.getMonth(), day);
    
    if (!tempFrom || (tempFrom && tempTo)) {
      setTempFrom(clickedDate);
      setTempTo(null);
      setSelectedPreset(null);
    } else if (tempFrom && !tempTo) {
      if (clickedDate < tempFrom) {
        setTempTo(tempFrom);
        setTempFrom(clickedDate);
      } else {
        setTempTo(clickedDate);
      }
    }
  };

  const handleApply = () => {
    if (tempFrom && tempTo) {
      onChange({ from: tempFrom, to: tempTo });
      setIsOpen(false);
      setShowYearSelector(false);
      if (onPresetChange) onPresetChange("custom");
    }
  };

  const handleCancel = () => {
    setTempFrom(value.from);
    setTempTo(value.to);
    setIsOpen(false);
    setShowYearSelector(false);
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    const range = preset.getRange();
    setTempFrom(range.from);
    setTempTo(range.to);
    setSelectedPreset(preset.label);
    onChange(range);
    setIsOpen(false);
    setShowYearSelector(false);
    if (onPresetChange) onPresetChange(preset.label);
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setViewMonth(new Date(year, viewMonth.getMonth(), 1));
    setShowYearSelector(false);
  };

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(viewYear, viewMonth.getMonth() + delta, 1);
    setViewYear(newDate.getFullYear());
    setViewMonth(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth.getMonth());
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth.getMonth());
    const today = new Date();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth.getMonth(), d);
      const isSelected = (tempFrom && date.toDateString() === tempFrom.toDateString()) ||
                        (tempTo && date.toDateString() === tempTo.toDateString());
      const isInRange = tempFrom && tempTo && date > tempFrom && date < tempTo;
      const isToday = date.toDateString() === today.toDateString();
      
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={cn(
            "h-8 w-8 rounded-full text-sm transition-colors flex items-center justify-center",
            isSelected && "bg-gold text-white",
            isInRange && "bg-gold/20",
            !isSelected && !isInRange && "hover:bg-muted",
            isToday && !isSelected && "border border-gold"
          )}
        >
          {d}
        </button>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isCustomRange = !PRESETS.some(p => {
    const range = p.getRange();
    return range.from.toDateString() === value.from.toDateString() && 
           range.to.toDateString() === value.to.toDateString();
  });

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-muted transition-colors"
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>
          {formatDate(value.from)} - {formatDate(value.to)}
          {isCustomRange && <span className="ml-1 text-xs text-gold">(Custom)</span>}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[750px] bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg z-50 p-4">
          <div className="flex gap-4">
            {/* Presets Sidebar */}
            <div className="w-40 border-r border-border pr-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      selectedPreset === preset.label && !isCustomRange
                        ? "bg-gold/10 text-gold font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="flex-1">
              {/* Month and Year Selector */}
              <div className="flex items-center justify-between mb-4 gap-2">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-1 hover:bg-muted rounded-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {monthNames[viewMonth.getMonth()]}
                  </span>
                  
                  {/* Year Selector Dropdown */}
                  <div className="relative" ref={yearSelectorRef}>
                    <button
                      onClick={() => setShowYearSelector(!showYearSelector)}
                      className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-md transition-colors font-medium"
                    >
                      {viewYear}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", showYearSelector && "rotate-180")} />
                    </button>
                    
                    {showYearSelector && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-900 border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                        {YEARS.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={cn(
                              "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors",
                              viewYear === year && "bg-gold/10 text-gold font-medium"
                            )}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-1 hover:bg-muted rounded-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>

              {/* Selected Range Display & Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {tempFrom && tempTo && (
                    <span>Selected: {formatDate(tempFrom)} - {formatDate(tempTo)}</span>
                  )}
                  {tempFrom && !tempTo && (
                    <span>Select end date: {formatDate(tempFrom)}</span>
                  )}
                  {!tempFrom && <span>Select a start date</span>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleApply} disabled={!tempFrom || !tempTo}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}