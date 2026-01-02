import { VisitCard } from "./VisitCard";

interface Visit {
  id: string;
  visitType: "doctor" | "pharmacist" | "stockist";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
  [key: string]: unknown;
}

interface VisitListProps {
  visits: Visit[];
  searchQuery: string;
  filterType: string;
}

export function VisitList({ visits, searchQuery, filterType }: VisitListProps) {
  const filteredVisits = visits
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

  if (filteredVisits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No visits found</p>
        <p className="text-sm mt-1">Add a new visit to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Completed Visits ({filteredVisits.length})
      </h2>
      <div className="grid gap-4">
        {filteredVisits.map((visit) => (
          <VisitCard key={visit.id} visit={visit as any} />
        ))}
      </div>
    </div>
  );
}
