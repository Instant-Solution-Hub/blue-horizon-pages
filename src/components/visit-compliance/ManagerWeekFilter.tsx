// components/visit-compliance/ManagerWeekFilter.tsx
import React from 'react';

interface ManagerWeekFilterProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
  totalWeeks: number;
}

export const ManagerWeekFilter: React.FC<ManagerWeekFilterProps> = ({
  selectedWeek,
  onWeekChange,
  totalWeeks,
}) => {
  const weeks = [
    { value: 'all', label: 'All Weeks' },
    ...Array.from({ length: totalWeeks }, (_, i) => ({
      value: `week-${i + 1}`,
      label: `Week ${i + 1}`,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {weeks.map((week) => (
        <button
          key={week.value}
          onClick={() => onWeekChange(week.value)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            selectedWeek === week.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {week.label}
        </button>
      ))}
    </div>
  );
};