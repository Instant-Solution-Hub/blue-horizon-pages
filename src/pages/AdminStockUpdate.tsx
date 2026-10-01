import { useState, useMemo } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, FileSpreadsheet, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface EmployeeStockEntry {
  id: string;
  employeeName: string;
  role: string;
  productName: string;
  marketName: string;
  stockistName: string;
  quantity: number;
  date: string;
}

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();
const iso = (day: number, monthOffset = 0) =>
  new Date(y, m + monthOffset, Math.min(day, 28)).toISOString().slice(0, 10);

// Mock stock updates across all employees
const allStockEntries: EmployeeStockEntry[] = [
  { id: "1", employeeName: "Rahul Sharma", role: "Field Executive", productName: "Paracetamol 500mg", marketName: "North Zone", stockistName: "MedPlus Distributors", quantity: 500, date: iso(2) },
  { id: "2", employeeName: "Rahul Sharma", role: "Field Executive", productName: "Amoxicillin 250mg", marketName: "North Zone", stockistName: "Apollo Pharmacy", quantity: 200, date: iso(5) },
  { id: "3", employeeName: "Priya Patel", role: "Field Executive", productName: "Ibuprofen 400mg", marketName: "South Zone", stockistName: "HealthCare Supplies", quantity: 300, date: iso(8) },
  { id: "4", employeeName: "Priya Patel", role: "Field Executive", productName: "Cetirizine 10mg", marketName: "South Zone", stockistName: "PharmaCare Ltd", quantity: 150, date: iso(12) },
  { id: "5", employeeName: "Amit Kumar", role: "Field Executive", productName: "Omeprazole 20mg", marketName: "East Zone", stockistName: "MediStock India", quantity: 400, date: iso(15) },
  { id: "6", employeeName: "Amit Kumar", role: "Field Executive", productName: "Metformin 500mg", marketName: "East Zone", stockistName: "WellBeing Pharma", quantity: 250, date: iso(18) },
  { id: "7", employeeName: "Sneha Reddy", role: "Field Executive", productName: "Paracetamol 500mg", marketName: "West Zone", stockistName: "CureAll Distributors", quantity: 350, date: iso(22) },
  { id: "8", employeeName: "Vikram Singh", role: "Manager", productName: "Ibuprofen 400mg", marketName: "North Zone", stockistName: "MedPlus Distributors", quantity: 600, date: iso(10, -1) },
  { id: "9", employeeName: "Anita Desai", role: "Manager", productName: "Metformin 500mg", marketName: "South Zone", stockistName: "HealthCare Supplies", quantity: 450, date: iso(20, -1) },
];

const AdminStockUpdate = () => {
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredEntries = useMemo(
    () =>
      allStockEntries.filter((e) => {
        if (fromDate && e.date < fromDate) return false;
        if (toDate && e.date > toDate) return false;
        return true;
      }),
    [fromDate, toDate]
  );

  const handleClear = () => {
    setFromDate("");
    setToDate("");
  };

  const handleExport = () => {
    if (filteredEntries.length === 0) {
      toast({ title: "Nothing to export", description: "No stock entries match the current filter.", variant: "destructive" });
      return;
    }
    const rows = filteredEntries.map((e) => ({
      Employee: e.employeeName,
      Role: e.role,
      Product: e.productName,
      Market: e.marketName,
      Stockist: e.stockistName,
      Quantity: e.quantity,
      Date: e.date,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Updates");
    XLSX.writeFile(wb, "stock-updates.xlsx");
    toast({ title: "Exported", description: `${rows.length} stock entries exported to Excel.` });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Stock Updates</h1>
                <p className="text-muted-foreground mt-1">
                  All stock updates added by employees
                </p>
              </div>
              <Button onClick={handleExport} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            {/* Date Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-date">From Date</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date">To Date</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleClear} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Stock Entries ({filteredEntries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead>Stockist</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No stock updates found for the selected dates
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.employeeName}</TableCell>
                          <TableCell>{entry.role}</TableCell>
                          <TableCell>{entry.productName}</TableCell>
                          <TableCell>{entry.marketName}</TableCell>
                          <TableCell>{entry.stockistName}</TableCell>
                          <TableCell className="text-right">{entry.quantity}</TableCell>
                          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminStockUpdate;
