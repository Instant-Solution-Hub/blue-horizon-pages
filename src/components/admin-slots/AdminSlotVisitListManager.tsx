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
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

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
  handleStatusChange:(visitId: string, newStatus: "SCHEDULED" | "COMPLETED" | "MISSED") =>void
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


function DoctorVisitTable({
  title,
  visits,
  handleStatusChange
}: {
  title: string;
  visits: any[];
 handleStatusChange:(visitId: string, newStatus: "SCHEDULED" | "COMPLETED" | "MISSED") =>void
}) {

   const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({});
  
    const handleStatusSelect = (visitId: string, newStatus: string) => {
      setPendingStatus(prev => ({ ...prev, [visitId]: newStatus }));
    };
  
    const handleConfirmStatus = (visitId: string) => {
      const newStatus = pendingStatus[visitId];
      if (newStatus) {
        // Apply the status change
        handleStatusChange(visitId, newStatus as any);
        // Clear pending status
        setPendingStatus(prev => {
          const updated = { ...prev };
          delete updated[visitId];
          return updated;
        });
      }
    };
  
    const handleCancelStatus = (visitId: string) => {
      setPendingStatus(prev => {
        const updated = { ...prev };
        delete updated[visitId];
        return updated;
      });
    };

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
              <TableHead>Prescription Type</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Visit Status</TableHead>
              <TableHead>Action</TableHead>
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
                <TableCell>
                  {pendingStatus[visit.visitId] ? (
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium mr-1">
                        → {pendingStatus[visit.visitId]}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleConfirmStatus(visit.visitId)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelStatus(visit.visitId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Select
                      onValueChange={(value) => handleStatusSelect(visit.visitId, value)}
                      value={undefined}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="MISSED">Missed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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
  handleStatusChange
}: AdminSlotVisitListProps) {
  return (
    <div className="space-y-4">
      <DoctorVisitTable title="Doctor Visits" visits={doctorVisits} handleStatusChange={handleStatusChange} />
    </div>
  );
}
