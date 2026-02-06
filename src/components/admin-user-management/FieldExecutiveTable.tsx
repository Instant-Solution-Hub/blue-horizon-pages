import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface FieldExecutive {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  territory: string;
  region: string;
  markets: string[];
  managerId: string;
  managerName: string;
}

interface FieldExecutiveTableProps {
  fieldExecutives: FieldExecutive[];
  onEdit: (fe: FieldExecutive) => void;
}

const FieldExecutiveTable = ({ fieldExecutives, onEdit }: FieldExecutiveTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Employee Code</TableHead>
            <TableHead>Territory</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Markets</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fieldExecutives.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No field executives added yet
              </TableCell>
            </TableRow>
          ) : (
            fieldExecutives.map((fe) => (
              <TableRow key={fe.id}>
                <TableCell className="font-medium">{fe.name}</TableCell>
                <TableCell>{fe.email}</TableCell>
                <TableCell>{fe.phone}</TableCell>
                <TableCell>{fe.employeeCode}</TableCell>
                <TableCell>{fe.territory}</TableCell>
                <TableCell>{fe.region}</TableCell>
                <TableCell>{fe.markets.join(", ")}</TableCell>
                <TableCell>{fe.managerName}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(fe)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FieldExecutiveTable;
