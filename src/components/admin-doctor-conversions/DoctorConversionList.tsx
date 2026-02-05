import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import { DoctorConversion } from "@/pages/AdminDoctorConversions";

interface DoctorConversionListProps {
  conversions: DoctorConversion[];
  onDelete: (id: string) => void;
}

const DoctorConversionList = ({
  conversions,
  onDelete,
}: DoctorConversionListProps) => {
  // Group conversions by manager
  const groupedByManager = conversions.reduce((acc, conversion) => {
    const { managerId, managerName } = conversion;
    if (!acc[managerId]) {
      acc[managerId] = {
        managerName,
        conversions: [],
      };
    }
    acc[managerId].conversions.push(conversion);
    return acc;
  }, {} as Record<string, { managerName: string; conversions: DoctorConversion[] }>);

  if (conversions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No doctor conversions added yet.
            <br />
            Click "Add Conversion" to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByManager).map(([managerId, data]) => (
        <Card key={managerId}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {data.managerName}
              <span className="text-sm font-normal text-muted-foreground">
                ({data.conversions.length} conversion{data.conversions.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Executive</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.conversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell className="font-medium">
                      {conversion.fieldExecutiveName}
                    </TableCell>
                    <TableCell>{conversion.doctorName}</TableCell>
                    <TableCell>{conversion.productName}</TableCell>
                    <TableCell>{conversion.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(conversion.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorConversionList;
