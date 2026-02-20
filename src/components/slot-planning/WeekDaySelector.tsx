import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface WeekDaySelectorProps {
  selectedWeek: number;
  selectedDay: number;
  currentWeek: number;
  currentDay: number; 
  currentMonth?: number; // Add current month
  currentYear?: number; // Add current year
  isPastDisabled: boolean;
  onWeekChange: (week: number) => void;
  onDayChange: (day: number) => void;
}

const weeks = [1, 2, 3, 4];
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Reordered to start with Sunday

export function WeekDaySelector({
  selectedWeek,
  selectedDay,
  currentWeek,
  currentDay,
  currentMonth = new Date().getMonth(), // Default to current month
  currentYear = new Date().getFullYear(), // Default to current year
  isPastDisabled,
  onWeekChange,
  onDayChange,
}: WeekDaySelectorProps) {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [dayMapping, setDayMapping] = useState<Map<number, { date: number; label: string }>>(new Map());

  // Function to get the days that exist in the current month for a given week
  const getDaysInWeekForMonth = (week: number, month: number, year: number) => {
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay(); // Now this is correct: 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the date of the Sunday of the selected week
    // For Sunday-based weeks, the week starts on Sunday (index 0)
    const weekStartDate = 1 + (week - 1) * 7 - firstDayOfWeek;
    
    const days: number[] = [];
    const mapping = new Map();
    
    // Check each day of the week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      const currentDate = weekStartDate + i;
      const date = new Date(year, month, currentDate);
      
      // Check if this date is still in the same month
      if (date.getMonth() === month) {
        days.push(i + 1); // Day number (1-7, where 1 = Sunday, 2 = Monday, etc.)
        mapping.set(i + 1, {
          date: currentDate,
          label: `${dayLabels[i]} ${currentDate}`
        });
      }
    }
    
    return { days, mapping };
  };

  // Update available days when selected week or month/year changes
  useEffect(() => {
    const { days, mapping } = getDaysInWeekForMonth(selectedWeek, currentMonth, currentYear);
    setAvailableDays(days);
    setDayMapping(mapping);
    
    // If current selected day is not available in the new week, select the first available day
    if (!days.includes(selectedDay) && days.length > 0) {
      onDayChange(days[0]);
    }
  }, [selectedWeek, currentMonth, currentYear]);

  // Handle week change
  const handleWeekChange = (week: number) => {
    onWeekChange(week);
    // The useEffect above will handle updating available days and adjusting selected day
  };

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
          // Check if this week has any days in the current month
          const { days } = getDaysInWeekForMonth(week, currentMonth, currentYear);
          const hasDaysInMonth = days.length > 0;

          return (
            <Button
              key={week}
              variant={selectedWeek === week ? "default" : "outline"}
              size="sm"
              disabled={disabled || !hasDaysInMonth}
              onClick={() => !disabled && hasDaysInMonth && handleWeekChange(week)}
              className={cn(
                "min-w-[80px]",
                selectedWeek === week && "shadow-md",
                (disabled || !hasDaysInMonth) && "opacity-40 cursor-not-allowed"
              )}
            >
              Week {week}
              {!hasDaysInMonth && <span className="text-xs ml-1">(no days)</span>}
            </Button>
          );
        })}
      </div>

      {/* Day Selection */}
      {availableDays.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableDays.map((day) => {
            const disabled = isPastDay(day);
            const dayInfo = dayMapping.get(day);

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
                  {dayInfo?.label || dayLabels[day - 1]}
                </span>
                <span>Day {day}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}