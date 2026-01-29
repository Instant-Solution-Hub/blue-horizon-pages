import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface TerritoryData {
  territory: string;
  primaryTarget: number;
  secondaryTarget: number;
  weeklyPrimarySale: number;
  weeklySecondarySale: number;
  totalSubstockistStock: number;
}

interface TerritoryTargetTableProps {
  data: TerritoryData[];
  onUpdateData: (territory: string, field: string, value: number) => void;
}

const TerritoryTargetTable = ({ data, onUpdateData }: TerritoryTargetTableProps) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const calculateDeficit = (target: number, sale: number) => {
    return Math.max(0, target - sale);
  };

  const getDeficitBadge = (deficit: number, target: number) => {
    if (deficit === 0) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-1.5">OK</Badge>;
    }
    const percentage = (deficit / target) * 100;
    if (percentage > 50) {
      return <Badge variant="destructive" className="text-[10px] px-1.5">Critical</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] px-1.5">Behind</Badge>;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No territory data available. Set targets for Field Executives to see territory-wise data.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table className="text-xs md:text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold whitespace-nowrap px-2 md:px-4">Territory</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Pri. Target</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Sec. Target</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Wk Pri. Sale</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Wk Sec. Sale</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Pri. Deficit</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Sec. Deficit</TableHead>
            <TableHead className="font-semibold text-right whitespace-nowrap px-2 md:px-4">Sub. Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const primaryDeficit = calculateDeficit(row.primaryTarget, row.weeklyPrimarySale);
            const secondaryDeficit = calculateDeficit(row.secondaryTarget, row.weeklySecondarySale);

            return (
              <TableRow key={row.territory}>
                <TableCell className="px-2 md:px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="font-medium truncate max-w-[80px] md:max-w-none">{row.territory}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400 px-2 md:px-4">
                  {formatCurrency(row.primaryTarget)}
                </TableCell>
                <TableCell className="text-right font-medium text-green-600 dark:text-green-400 px-2 md:px-4">
                  {formatCurrency(row.secondaryTarget)}
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <Input
                    type="number"
                    value={row.weeklyPrimarySale}
                    onChange={(e) =>
                      onUpdateData(row.territory, "weeklyPrimarySale", parseFloat(e.target.value) || 0)
                    }
                    className="w-16 md:w-20 ml-auto text-right text-xs h-8 px-1.5"
                  />
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <Input
                    type="number"
                    value={row.weeklySecondarySale}
                    onChange={(e) =>
                      onUpdateData(row.territory, "weeklySecondarySale", parseFloat(e.target.value) || 0)
                    }
                    className="w-16 md:w-20 ml-auto text-right text-xs h-8 px-1.5"
                  />
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-medium text-destructive text-xs">
                      {formatCurrency(primaryDeficit)}
                    </span>
                    {getDeficitBadge(primaryDeficit, row.primaryTarget)}
                  </div>
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-medium text-destructive text-xs">
                      {formatCurrency(secondaryDeficit)}
                    </span>
                    {getDeficitBadge(secondaryDeficit, row.secondaryTarget)}
                  </div>
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <Input
                    type="number"
                    value={row.totalSubstockistStock}
                    onChange={(e) =>
                      onUpdateData(row.territory, "totalSubstockistStock", parseFloat(e.target.value) || 0)
                    }
                    className="w-16 md:w-20 ml-auto text-right text-xs h-8 px-1.5"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TerritoryTargetTable;
