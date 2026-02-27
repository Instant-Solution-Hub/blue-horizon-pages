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
  isPastDisabled: boolean;
  onWeekChange: (week: number) => void;
  onDayChange: (day: number) => void;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekDaySelector({
  selectedWeek,
  selectedDay,
  currentWeek,
  currentDay,
  currentMonth = new Date().getMonth(), // 0-based
  currentYear = new Date().getFullYear(),
  isPastDisabled,
  onWeekChange,
  onDayChange,
}: WeekDaySelectorProps) {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [dayMapping, setDayMapping] = useState<
    Map<number, { date: number; label: string }>
  >(new Map());

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
      { date: number; label: string }
    >();

    for (let i = 0; i < 7; i++) {
      const currentDate = weekStartDate + i;
      const dateObj = new Date(year, month, currentDate);

      if (dateObj.getMonth() === month) {
        days.push(i + 1);
        mapping.set(i + 1, {
          date: currentDate,
          label: `${dayLabels[i]} ${currentDate}`,
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
    setDayMapping(mapping);

    if (!days.includes(selectedDay) && days.length > 0) {
      onDayChange(days[0]);
    }
  }, [selectedWeek, currentMonth, currentYear]);

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
                !disabled && hasDaysInMonth && onWeekChange(week)
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

            return (
              <Button
                key={day}
                variant={selectedDay === day ? "secondary" : "ghost"}
                size="sm"
                disabled={disabled}
                onClick={() => !disabled && onDayChange(day)}
                className={cn(
                  "min-w-[70px] flex flex-col gap-0 h-auto py-2",
                  selectedDay === day && "ring-2 ring-primary/50",
                  disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-xs text-muted-foreground">
                  {dayInfo?.label}
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