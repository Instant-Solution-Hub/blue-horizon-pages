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

export interface PharmacistSlotVisit {
  visitId: number;
  pharmacyId: number;
  pharmacyName: string;
  contactPerson: string;
  weekNumber: number;
  dayOfWeek: number;
  status: string;
  visitType: "PHARMACIST";
  completedVisitCount: number;
  plannedVisitCount: number;
}


interface PharmacistSlotTableProps {
  title: string;
  visits: PharmacistSlotVisit[];
}

export function PharmacistSlotTable({
  title,
  visits,
}: PharmacistSlotTableProps) {
  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No pharmacist visits scheduled for this day.
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
              <TableHead>Pharmacy Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Planned Visits</TableHead>
              <TableHead>Completed Visits</TableHead>
              <TableHead>Visit Track</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.visitId}>
                <TableCell className="font-medium">
                  {visit.pharmacyName}
                </TableCell>

                <TableCell>{visit.contactPerson}</TableCell>

                <TableCell>{visit.plannedVisitCount}</TableCell>

                <TableCell>{visit.completedVisitCount}</TableCell>

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
