import { VisitCard } from "./VisitCard";

export interface Visit {
  id: string;
  visitType: "doctor" | "pharmacist" | "stockist";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
  [key: string]: unknown;
}

interface VisitListProps {
  completedVisits: Visit[];
  missedVisits: Visit[];
  searchQuery: string;
  filterType: string;
}

export function VisitList({ completedVisits, missedVisits, searchQuery, filterType }: VisitListProps) {
  const filteredCompletedVisits = completedVisits
    .filter((visit) => {
      if (filterType !== "all" && visit.visitType !== filterType) {
        return false;
      }
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchableFields = Object.values(visit).filter(
          (v) => typeof v === "string"
        );
        return searchableFields.some((field) =>
          (field as string).toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());


    const filteredMissedVisits = missedVisits
    .filter((visit) => {
      if (filterType !== "all" && visit.visitType !== filterType) {
        return false;
      }
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchableFields = Object.values(visit).filter(
          (v) => typeof v === "string"
        );
        return searchableFields.some((field) =>
          (field as string).toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  if (filteredCompletedVisits.length === 0 && filteredMissedVisits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No visits found</p>
        <p className="text-sm mt-1">Mark a visit to get started</p>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Completed Visits ({filteredCompletedVisits.length})
      </h2>
      <div className="grid gap-4">
        {filteredCompletedVisits.map((visit) => (
          <VisitCard key={visit.id} visit={visit as any} />
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Missed Visits ({filteredMissedVisits.length})
      </h2>
      <div className="grid gap-4">
        {filteredMissedVisits.map((visit) => (
          <VisitCard key={visit.id} visit={visit as any} />
        ))}
      </div>
    </div>
    </>
    
  );
}
