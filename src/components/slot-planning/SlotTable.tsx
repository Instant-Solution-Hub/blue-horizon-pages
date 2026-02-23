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

export interface SlotVisit {
  id: number;
  type: "doctor" | "pharmacist";
  doctorName: string;
  category?: string;
  practiceType?: string;
  specialization?: string;
  hospitalName: string;
  status: string;
}

interface SlotTableProps {
  title: string;
  visits: SlotVisit[];
}

const categoryColors: Record<string, string> = {
  A_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-300",
  A: "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-amber-100 text-amber-800 border-amber-300",
};

const practiceTypeLabels: Record<string, string> = {
  RP: "RP",
  OP: "OP",
  NP: "NP",
};

export function SlotTable({ title, visits }: SlotTableProps) {
  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No visits scheduled for this day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Prescription Type</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Visit Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.doctorName}</TableCell>
                <TableCell>
                  {visit.category && (
                    <Badge
                      variant="outline"
                      className={categoryColors[visit.category] || ""}
                    >
                      {visit.category === "A_PLUS" ? "A+" : visit.category}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {visit.practiceType && (
                    <span className="text-sm text-muted-foreground">
                      {practiceTypeLabels[visit.practiceType] || visit.practiceType}
                    </span>
                  )}
                </TableCell>
                <TableCell>{visit.specialization || "-"}</TableCell>
                <TableCell>{visit.hospitalName}</TableCell>
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
