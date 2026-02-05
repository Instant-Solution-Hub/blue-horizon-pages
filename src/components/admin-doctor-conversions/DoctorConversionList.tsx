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
import { Trash2, Users, FileText } from "lucide-react"; // Added FileText for empty state
import { DoctorConversion } from "@/services/DoctorConversion";
import { format } from "date-fns";

interface DoctorConversionListProps {
  conversions: DoctorConversion[];
  onDelete: (feId: number, id: number) => void;
}

const DoctorConversionList = ({
  conversions,
  onDelete,
}: DoctorConversionListProps) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy");
    } catch {
      return dateString;
    }
  };

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
      <Card className="border-dashed border-2 border-slate-200 shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-600">No conversions recorded</p>
          <p className="text-sm text-slate-400 text-center mt-1">
            Click "Add Conversion" to get started with your first entry.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedByManager).map(([managerId, data]) => (
        <Card 
          key={managerId} 
          className="overflow-hidden border-blue-100 shadow-lg shadow-indigo-100/50"
        >
          {/* Card Header with Custom Blue Background */}
          <CardHeader className="pb-4 bg-[rgb(61,83,209)]/5 border-b border-blue-100">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[rgb(61,83,209)] p-2 rounded-lg shadow-sm">
                   <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[rgb(61,83,209)] font-bold tracking-tight">{data.managerName}</span>
                  <span className="text-xs font-normal text-slate-500">Regional Manager</span>
                </div>
              </div>
              <span className="bg-white text-[rgb(61,83,209)] text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                {data.conversions.length} Conversion{data.conversions.length !== 1 ? "s" : ""}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-slate-50/50 border-b border-blue-50">
                  <TableHead className="font-semibold text-[rgb(61,83,209)] pl-6">Field Executive</TableHead>
                  <TableHead className="font-semibold text-[rgb(61,83,209)]">Doctor (Hospital)</TableHead>
                  <TableHead className="font-semibold text-[rgb(61,83,209)]">Product</TableHead>
                  <TableHead className="font-semibold text-[rgb(61,83,209)]">Date</TableHead>
                  <TableHead className="font-semibold text-[rgb(61,83,209)] w-[80px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.conversions.map((conversion) => (
                  <TableRow 
                    key={conversion.id} 
                    className="hover:bg-blue-50/30 border-b-slate-50 last:border-0 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-700 pl-6 py-4">
                      {conversion.fieldExecutiveName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{conversion.doctorName}</span>
                        {conversion.hospitalName && (
                          <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            {conversion.hospitalName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {conversion.productName}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(conversion.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(conversion.fieldExecutiveId, conversion.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
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