import { useState } from "react";
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDeficit = (target: number, sale: number) => {
    return Math.max(0, target - sale);
  };

  const getDeficitBadge = (deficit: number, target: number) => {
    if (deficit === 0) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">On Track</Badge>;
    }
    const percentage = (deficit / target) * 100;
    if (percentage > 50) {
      return <Badge variant="destructive">Critical</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Behind</Badge>;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No territory data available. Set targets for Field Executives to see territory-wise data.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Territory</TableHead>
            <TableHead className="font-semibold text-right">Primary Target</TableHead>
            <TableHead className="font-semibold text-right">Secondary Target</TableHead>
            <TableHead className="font-semibold text-right">Weekly Primary Sale</TableHead>
            <TableHead className="font-semibold text-right">Weekly Secondary Sale</TableHead>
            <TableHead className="font-semibold text-right">Primary Deficit</TableHead>
            <TableHead className="font-semibold text-right">Secondary Deficit</TableHead>
            <TableHead className="font-semibold text-right">Substockist Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const primaryDeficit = calculateDeficit(row.primaryTarget, row.weeklyPrimarySale);
            const secondaryDeficit = calculateDeficit(row.secondaryTarget, row.weeklySecondarySale);

            return (
              <TableRow key={row.territory}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{row.territory}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400">
                  {formatCurrency(row.primaryTarget)}
                </TableCell>
                <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(row.secondaryTarget)}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={row.weeklyPrimarySale}
                    onChange={(e) =>
                      onUpdateData(row.territory, "weeklyPrimarySale", parseFloat(e.target.value) || 0)
                    }
                    className="w-28 ml-auto text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={row.weeklySecondarySale}
                    onChange={(e) =>
                      onUpdateData(row.territory, "weeklySecondarySale", parseFloat(e.target.value) || 0)
                    }
                    className="w-28 ml-auto text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium text-destructive">
                      {formatCurrency(primaryDeficit)}
                    </span>
                    {getDeficitBadge(primaryDeficit, row.primaryTarget)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium text-destructive">
                      {formatCurrency(secondaryDeficit)}
                    </span>
                    {getDeficitBadge(secondaryDeficit, row.secondaryTarget)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={row.totalSubstockistStock}
                    onChange={(e) =>
                      onUpdateData(row.territory, "totalSubstockistStock", parseFloat(e.target.value) || 0)
                    }
                    className="w-28 ml-auto text-right"
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
