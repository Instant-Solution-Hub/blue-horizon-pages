import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AdminSlotVisit {
  id: number;
  type: "doctor" | "pharmacist";
  name: string;
  category?: string;
  practiceType?: string;
  designation?: string;
  hospitalName: string;
  visitTrack: string;
}

interface AdminSlotVisitListProps {
  doctorVisits: AdminSlotVisit[];
  pharmacistVisits: AdminSlotVisit[];
}

const categoryColors: Record<string, string> = {
  A_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-300",
  A: "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-amber-100 text-amber-800 border-amber-300",
};

const practiceTypeLabels: Record<string, string> = {
  RP: "Retail Practice",
  OP: "Own Practice",
  NP: "Nursing Practice",
};


function DoctorVisitTable({
  title,
  visits,
}: {
  title: string;
  visits: any[];
}) {
  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No visits for this day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title} ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Practice Type</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Visit Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.doctor.name}</TableCell>
                <TableCell>
                  {visit.doctor.category ? (
                    <Badge
                      variant="outline"
                      className={categoryColors[visit.doctor.category] || ""}
                    >
                      {visit.doctor.category === "A_PLUS" ? "A+" : visit.doctor.category}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {visit.doctor.practiceType ? (
                    <span className="text-sm text-muted-foreground">
                      {practiceTypeLabels[visit.doctor.practiceType] ||
                        visit.doctor.practiceType}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{visit.doctor.designation || "-"}</TableCell>
                <TableCell>{visit.doctor.hospitalName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{visit.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AdminSlotVisitListManager({
  doctorVisits,
}: AdminSlotVisitListProps) {
  return (
    <div className="space-y-4">
      <DoctorVisitTable title="Doctor Visits" visits={doctorVisits} />
    </div>
  );
}
