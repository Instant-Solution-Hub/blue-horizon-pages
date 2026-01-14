import { Button } from "@/components/ui/button";

interface WeekFilterProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

const weeks = [
  { value: "all", label: "All" },
  { value: "week1", label: "Week 1" },
  { value: "week2", label: "Week 2" },
  { value: "week3", label: "Week 3" },
  { value: "week4", label: "Week 4" },
];

export function WeekFilter({ selectedWeek, onWeekChange }: WeekFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {weeks.map((week) => (
        <Button
          key={week.value}
          variant={selectedWeek === week.value ? "default" : "outline"}
          size="sm"
          onClick={() => onWeekChange(week.value)}
        >
          {week.label}
        </Button>
      ))}
    </div>
  );
}
