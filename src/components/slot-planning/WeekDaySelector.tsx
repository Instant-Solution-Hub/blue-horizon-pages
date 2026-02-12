import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface WeekDaySelectorProps {
  selectedWeek: number;
  selectedDay: number;
  currentWeek: number;
  currentDay: number; 
  isPastDisabled: boolean;
  onWeekChange: (week: number) => void;
  onDayChange: (day: number) => void;
}

const weeks = [1, 2, 3, 4];
const days = [1, 2, 3, 4, 5, 6, 7];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekDaySelector({
  selectedWeek,
  selectedDay,
  currentWeek,
  currentDay,
  isPastDisabled,
  onWeekChange,
  onDayChange,
}: WeekDaySelectorProps) {
  const isPastWeek = (week: number) => {
    if (!isPastDisabled) return false;
    return week < currentWeek;
  };

  const isPastDay = (day: number) => {
    if (!isPastDisabled) return false;
    if (selectedWeek < currentWeek) return true;
    if (selectedWeek === currentWeek && day < currentDay) return true;
    return false;
  };

  useEffect(() => {
  if (selectedWeek === currentWeek && selectedDay < currentDay) {
    onDayChange(currentDay);
  }
}, [selectedWeek]);


  return (
    <div className="space-y-4">
      {/* Week Selection */}
      <div className="flex flex-wrap gap-2">
        {weeks.map((week) => {
          const disabled = isPastWeek(week);

          return (
            <Button
              key={week}
              variant={selectedWeek === week ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => !disabled && onWeekChange(week)}
              className={cn(
                "min-w-[80px]",
                selectedWeek === week && "shadow-md",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              Week {week}
            </Button>
          );
        })}
      </div>

      {/* Day Selection */}
      <div className="flex flex-wrap gap-2">
        {days.map((day, index) => {
          const disabled = isPastDay(day);

          return (
            <Button
              key={day}
              variant={selectedDay === day ? "secondary" : "ghost"}
              size="sm"
              disabled={disabled}
              onClick={() => !disabled && onDayChange(day)}
              className={cn(
                "min-w-[60px] flex flex-col gap-0 h-auto py-2",
                selectedDay === day && "ring-2 ring-primary/50",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-xs text-muted-foreground">
                {dayLabels[index]}
              </span>
              <span>Day {day}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

