import { useMemo } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";

export interface EmployeeStockEntry {
  id: string;
  employeeName: string;
  productName: string;
  marketName: string;
  stockistName: string;
  quantity: number;
  date: string; // ISO date
}

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();
const iso = (day: number) =>
  new Date(y, m, Math.min(day, 28)).toISOString().slice(0, 10);

// Mock stock updates made by the manager's team members this month
const teamStockEntries: EmployeeStockEntry[] = [
  { id: "1", employeeName: "Rahul Sharma", productName: "Paracetamol 500mg", marketName: "North Zone", stockistName: "MedPlus Distributors", quantity: 500, date: iso(2) },
  { id: "2", employeeName: "Rahul Sharma", productName: "Amoxicillin 250mg", marketName: "North Zone", stockistName: "Apollo Pharmacy", quantity: 200, date: iso(5) },
  { id: "3", employeeName: "Priya Patel", productName: "Ibuprofen 400mg", marketName: "South Zone", stockistName: "HealthCare Supplies", quantity: 300, date: iso(8) },
  { id: "4", employeeName: "Priya Patel", productName: "Cetirizine 10mg", marketName: "South Zone", stockistName: "PharmaCare Ltd", quantity: 150, date: iso(12) },
  { id: "5", employeeName: "Amit Kumar", productName: "Omeprazole 20mg", marketName: "East Zone", stockistName: "MediStock India", quantity: 400, date: iso(15) },
  { id: "6", employeeName: "Amit Kumar", productName: "Metformin 500mg", marketName: "East Zone", stockistName: "WellBeing Pharma", quantity: 250, date: iso(18) },
  { id: "7", employeeName: "Sneha Reddy", productName: "Paracetamol 500mg", marketName: "West Zone", stockistName: "CureAll Distributors", quantity: 350, date: iso(22) },
];

const ManagerEmployeeStock = () => {
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  const currentMonthEntries = useMemo(
    () =>
      teamStockEntries.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === y && d.getMonth() === m;
      }),
    []
  );

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Stock Updates</h1>
              <p className="text-muted-foreground mt-1">
                Stock updates added by your team members for {monthLabel}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Stock Entries ({currentMonthEntries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead>Stockist</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMonthEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No stock updates this month
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentMonthEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.employeeName}</TableCell>
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

export default ManagerEmployeeStock;
