import { useMemo, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { PackageOpen, X, CalendarIcon } from "lucide-react";
import ManagerLiquidationList from "@/components/manager-stock-liquidation/ManagerLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LiquidationPlanWithMeta {
  id: string;
  product: string;
  quantity: number;
  doctor: string;
  targetLiquidation: number;
  achievedUnits: number;
  marketName: string;
  medicalShopName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  submittedBy: string;
  employeeId: number;
  liquidated1?: number;
  liquidated2?: number;
  liquidated3?: number;
}

const mockEmployees: Person[] = [
  { id: 1, name: "Rahul Verma", employeeCode: "FE001", territory: "North Zone" },
  { id: 2, name: "Amit Gupta", employeeCode: "FE002", territory: "East Zone" },
  { id: 3, name: "Suresh Nair", employeeCode: "FE003", territory: "West Zone" },
];

const mockPlans: LiquidationPlanWithMeta[] = [
  {
    id: "1", product: "Paracetamol 500mg", quantity: 1500, doctor: "Dr. Rajesh Kumar",
    targetLiquidation: 200, achievedUnits: 120, marketName: "Central Market",
    medicalShopName: "Apollo Pharmacy", status: "PENDING", createdAt: new Date("2024-01-15"),
    submittedBy: "Rahul Verma", employeeId: 1, liquidated1: 80, liquidated2: 40, liquidated3: 0,
  },
  {
    id: "2", product: "Paracetamol 500mg", quantity: 1500, doctor: "Dr. Priya Sharma",
    targetLiquidation: 150, achievedUnits: 0, marketName: "East Zone",
    status: "PENDING", createdAt: new Date("2024-01-16"),
    submittedBy: "Amit Gupta", employeeId: 2, liquidated1: 50, liquidated2: 0, liquidated3: 0,
  },
  {
    id: "3", product: "Amoxicillin 250mg", quantity: 800, doctor: "Dr. Amit Patel",
    targetLiquidation: 100, achievedUnits: 75, marketName: "West Market",
    medicalShopName: "MedPlus", status: "APPROVED", createdAt: new Date("2024-01-17"),
    submittedBy: "Suresh Nair", employeeId: 3, liquidated1: 30, liquidated2: 45, liquidated3: 0,
  },
  {
    id: "4", product: "Omeprazole 20mg", quantity: 1200, doctor: "Dr. Sunita Reddy",
    targetLiquidation: 300, achievedUnits: 0, marketName: "North Market",
    status: "PENDING", createdAt: new Date("2024-01-18"),
    submittedBy: "Rahul Verma", employeeId: 1, liquidated1: 100, liquidated2: 0, liquidated3: 0,
  },
];

const ManagerStockLiquidation = () => {
  const [plans, setPlans] = useState<LiquidationPlanWithMeta[]>(mockPlans);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const filteredPlans = useMemo(() => {
    if (!selectedEmployeeId) return [];
    return plans.filter((p) => {
      if (p.employeeId !== selectedEmployeeId) return false;
      const created = new Date(p.createdAt);
      if (fromDate && created < fromDate) return false;
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (created > end) return false;
      }
      return true;
    });
  }, [plans, selectedEmployeeId, fromDate, toDate]);

  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleUpdateStatus = (id: string, status: "APPROVED" | "REJECTED") => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Stock Liquidation
              </h1>
              <p className="text-muted-foreground mt-1">
                Select a team member to review their liquidation plans
              </p>
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-end gap-3 p-4 border rounded-lg bg-card">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="ghost" onClick={handleClear} className="gap-2">
              <X className="h-4 w-4" /> Clear
            </Button>
          </div>

          {/* Employee Selector */}
          <PersonSelector
            persons={mockEmployees}
            selectedPersonId={selectedEmployeeId}
            onSelect={setSelectedEmployeeId}
            placeholder="Search team member by name or employee ID..."
          />

          {selectedEmployeeId && (
            <>
              <StatsCards plans={filteredPlans as any} />
              <ManagerLiquidationList
                plans={filteredPlans as any}
                onUpdateStatus={handleUpdateStatus}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerStockLiquidation;
