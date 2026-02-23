import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface FEProductSale {
  feName: string;
  productName: string;
  pts: number;
  quantity: number;
  sales: number;
}

interface AdminFEProductTableProps {
  data: FEProductSale[];
}

const AdminFEProductTable = ({ data }: AdminFEProductTableProps) => {
  if (data.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Product Wise Sales (FE)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">No data available.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">Product Wise Sales (FE)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="text-xs md:text-sm">
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5">
              <TableHead className="w-16 font-semibold text-primary">SL.NO</TableHead>
              <TableHead className="font-semibold text-primary">FE Name</TableHead>
              <TableHead className="font-semibold text-primary">Product Name</TableHead>
              <TableHead className="font-semibold text-primary">New PTS (₹)</TableHead>
              <TableHead className="font-semibold text-primary">Qty</TableHead>
              <TableHead className="font-semibold text-primary">Sales (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-primary/5 transition-colors border-b border-primary/10">
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{row.feName}</TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell className="text-muted-foreground">₹{row.pts.toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-primary">{row.quantity}</TableCell>
                <TableCell className="font-semibold text-green-600">₹{row.sales.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminFEProductTable;
