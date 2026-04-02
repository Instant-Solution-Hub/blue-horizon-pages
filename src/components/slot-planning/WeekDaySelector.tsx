import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface WeekDaySelectorProps {
  selectedWeek: number;
  selectedDay: number;
  currentWeek: number;
  currentDay: number;
  currentMonth?: number; // 0-based (IMPORTANT)
  currentYear?: number;
  dayMapping?: Map<number, { date: number; label: string; isHoliday: boolean }>;
  setDayMapping?:(mapping: Map<number, { date: number; label: string; isHoliday: boolean }>) => void;
  isPastDisabled: boolean;
  onWeekChange: (week: number) => void;
  onDayChange: (day: number) => void;
  holidays?: string[]; // Add holidays prop
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Parse holiday dates and create a Set for quick lookup
const parseHolidays = (holidayList: string[]): Set<string> => {
  return new Set(holidayList);
};

export function WeekDaySelector({
  selectedWeek,
  selectedDay,
  currentWeek,
  currentDay,
  currentMonth = new Date().getMonth(), // 0-based
  currentYear = new Date().getFullYear(),
  isPastDisabled,
  dayMapping,
  setDayMapping,
  onWeekChange,
  onDayChange,
  holidays = [], // Default to empty array
}: WeekDaySelectorProps) {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  // const [dayMapping, setDayMapping] = useState<
  //   Map<number, { date: number; label: string; isHoliday: boolean }>
  // >(new Map());

  // Parse holidays into a Set for quick lookup
  const holidaySet = useMemo(() => {
    return new Set(holidays);
  }, [holidays]);

  // Get total weeks dynamically (4,5,6)
  const totalWeeks = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    return Math.ceil((firstDay + totalDays) / 7);
  }, [currentMonth, currentYear]);

  const weeks = useMemo(
    () => Array.from({ length: totalWeeks }, (_, i) => i + 1),
    [totalWeeks]
  );

  const getDaysInWeekForMonth = (
    week: number,
    month: number,
    year: number
  ) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const weekStartDate = 1 + (week - 1) * 7 - firstDayOfWeek;

    const days: number[] = [];
    const mapping = new Map<
      number,
      { date: number; label: string; isHoliday: boolean }
    >();

    for (let i = 0; i < 7; i++) {
      const currentDate = weekStartDate + i;
      const dateObj = new Date(year, month, currentDate);

      if (dateObj.getMonth() === month) {
        // Format date as YYYY-MM-DD for holiday lookup
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;
        const isHoliday = holidaySet.has(dateString);
        
        days.push(i + 1);
        mapping.set(i + 1, {
          date: currentDate,
          label: `${dayLabels[i]} ${currentDate}`,
          isHoliday,
        });
      }
    }

    return { days, mapping };
  };

useEffect(() => {
    const { days, mapping } = getDaysInWeekForMonth(
      selectedWeek,
      currentMonth,
      currentYear
    );

    setAvailableDays(days);
    if (setDayMapping) {
      setDayMapping(mapping);
    }
  }, [selectedWeek, currentMonth, currentYear, holidaySet]);


 // Separate effect to handle day selection when week changes
  // useEffect(() => {
  //   if (availableDays.length > 0) {
  //     // Check if current selected day is valid in the new week
  //     if (!availableDays.includes(selectedDay)) {
  //       // If not valid, select the first available day
  //       onDayChange(availableDays[0]);
  //     }
  //   }
  // }, [availableDays, selectedDay, onDayChange]);

  const handleWeekChange = (week: number) => {
    // First, get the days for the new week
    const { days } = getDaysInWeekForMonth(week, currentMonth, currentYear);
    
    // Call onWeekChange to update the parent state
    onWeekChange(week);
    
    // Immediately update the day to the first day of the new week
    // This ensures the day changes at the same time as the week
    if (days.length > 0) {
      onDayChange(days[0]);
    }
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

  return (
    <div className="space-y-4">
      {/* Week Selection */}
      <div className="flex flex-wrap gap-2">
        {weeks.map((week) => {
          const disabled = isPastWeek(week);
          const { days } = getDaysInWeekForMonth(
            week,
            currentMonth,
            currentYear
          );

          const hasDaysInMonth = days.length > 0;

          return (
            <Button
              key={week}
              variant={selectedWeek === week ? "default" : "outline"}
              size="sm"
              disabled={disabled || !hasDaysInMonth}
              onClick={() =>
                !disabled && hasDaysInMonth && handleWeekChange(week)
              }
              className={cn(
                "min-w-[80px]",
                selectedWeek === week && "shadow-md",
                (disabled || !hasDaysInMonth) &&
                  "opacity-40 cursor-not-allowed"
              )}
            >
              Week {week}
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
            const isHoliday = dayInfo?.isHoliday || false;

            return (
              <Button
                key={day}
                variant={selectedDay === day ? "secondary" : "ghost"}
                size="sm"
                disabled={disabled}
                onClick={() => !disabled && onDayChange(day)}
                className={cn(
                  "min-w-[70px] flex flex-col gap-0 h-auto py-2 relative",
                  selectedDay === day && "ring-2 ring-primary/50",
                  disabled && "opacity-40 cursor-not-allowed",
                  isHoliday && !disabled && "bg-red-50 hover:bg-red-100 border-red-200"
                )}
              >
                {/* Holiday indicator */}
                {isHoliday && !disabled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <span className={cn(
                  "text-xs",
                  isHoliday && !disabled ? "text-red-600 font-medium" : "text-muted-foreground"
                )}>
                  {dayInfo?.label}
                </span>
                <span className={cn(
                  isHoliday && !disabled && "text-red-700"
                )}>
                  Day {day}
                  {/* {isHoliday && !disabled && " 🎉"} */}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}