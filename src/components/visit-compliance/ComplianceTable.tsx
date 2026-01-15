import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface ComplianceRecord {
  id: string;
  name: string; // Changed from doctorName to professionalName
  category: string;
  scheduledDate: Date;
  status: "scheduled" | "completed" | "missed";
  reason?: string;
  week: number;
  visitType: "doctor" | "pharmacist"; // Add this
}
interface ComplianceTableProps {
  records: ComplianceRecord[];
}

const categoryColors: Record<string, string> = {
  "A+": "bg-purple-100 text-purple-800",
  A: "bg-blue-100 text-blue-800",
  B: "bg-gray-100 text-gray-800",
};

export function ComplianceTable({ records }: ComplianceTableProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No compliance records found for the selected period.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={categoryColors[record.category]}>
                  {record.category}
                </Badge>
              </TableCell>
              <TableCell>{format(record.scheduledDate, "dd MMM yyyy")}</TableCell>
              <TableCell>
                <Badge
                  variant={record.status === "completed" ? "default" : "destructive"}
                  className={
                    record.status === "completed"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {record.status === "completed" ? "Completed" : "Missed"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {record.reason || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
