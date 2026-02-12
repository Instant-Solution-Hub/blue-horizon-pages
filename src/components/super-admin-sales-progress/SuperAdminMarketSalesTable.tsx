import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin } from "lucide-react";

interface MarketSale {
  id: number;
  marketName: string;
  secondarySales: number;
}

const marketData: MarketSale[] = [
  { id: 1, marketName: "North Region", secondarySales: 125000 },
  { id: 2, marketName: "South Region", secondarySales: 180000 },
  { id: 3, marketName: "East Region", secondarySales: 95000 },
  { id: 4, marketName: "West Region", secondarySales: 145000 },
  { id: 5, marketName: "Central Region", secondarySales: 110000 },
];

const SuperAdminMarketSalesTable = () => {
  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Market Wise Sales
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Regional performance overview</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-16 font-semibold text-primary">SL.NO</TableHead>
                <TableHead className="font-semibold text-primary">Market</TableHead>
                <TableHead className="font-semibold text-primary text-right">Secondary Sales (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((market, index) => (
                <TableRow
                  key={market.id}
                  className="hover:bg-primary/5 transition-colors duration-200 border-b border-primary/10"
                >
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{market.marketName}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">
                      ₹{market.secondarySales.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminMarketSalesTable;
