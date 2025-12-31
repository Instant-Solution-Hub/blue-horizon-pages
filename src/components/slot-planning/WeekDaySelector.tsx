import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekDaySelectorProps {
  selectedWeek: number;
  selectedDay: number;
  onWeekChange: (week: number) => void;
  onDayChange: (day: number) => void;
}

const weeks = [1, 2, 3, 4];
const days = [1, 2, 3, 4, 5, 6, 7];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekDaySelector({
  selectedWeek,
  selectedDay,
  onWeekChange,
  onDayChange,
}: WeekDaySelectorProps) {
  return (
    <div className="space-y-4">
      {/* Week Selection */}
      <div className="flex flex-wrap gap-2">
        {weeks.map((week) => (
          <Button
            key={week}
            variant={selectedWeek === week ? "default" : "outline"}
            size="sm"
            onClick={() => onWeekChange(week)}
            className={cn(
              "min-w-[80px]",
              selectedWeek === week && "shadow-md"
            )}
          >
            Week {week}
          </Button>
        ))}
      </div>

      {/* Day Selection */}
      <div className="flex flex-wrap gap-2">
        {days.map((day, index) => (
          <Button
            key={day}
            variant={selectedDay === day ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onDayChange(day)}
            className={cn(
              "min-w-[60px] flex flex-col gap-0 h-auto py-2",
              selectedDay === day && "ring-2 ring-primary/50"
            )}
          >
            <span className="text-xs text-muted-foreground">{dayLabels[index]}</span>
            <span>Day {day}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
