import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { PackageOpen, X, CalendarIcon } from "lucide-react";
import ManagerLiquidationList from "@/components/manager-stock-liquidation/ManagerLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";
import {
  fetchEmployees,
  fetchLiquidationPlansForManager,
  fetchLiquidationPlansByDateRange,
} from "@/services/ManagerService";
import { updateLiquidationPlanStatus } from "@/services/LiquidationService";
import { LiquidationPlan } from "@/components/stock-liquidation/AddLiquidationModal";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ManagerLiquidationPlan extends LiquidationPlan {
  employeeId: number;
}

const ManagerStockLiquidation = () => {
  const managerId = Number(sessionStorage.getItem("userID"));

  const [plans, setPlans] = useState<ManagerLiquidationPlan[]>([]);
  const [employees, setEmployees] = useState<Person[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // 🔹 Fetch Employees
  const fetchEmployeesData = async () => {
    const employeesData = await fetchEmployees(managerId);
    setEmployees(employeesData);
  };

  // 🔹 Fetch Current Month Liquidation Plans
  const fetchLiquidationPlans = async () => {
    const res = await fetchLiquidationPlansForManager(managerId);

    const mappedPlans: ManagerLiquidationPlan[] = res.map((p: any) => ({
      ...p,
      id: String(p.id),
      createdAt: new Date(p.createdAt),
      product: p.productName ?? p.product ?? "",
      doctor: p.doctorName ?? p.doctor ?? "",
      productId: p.productId ?? p.productID ?? 0,
      doctorId: p.doctorId ?? p.doctorID ?? 0,
      liquidated1: Number(p.liquidated1 ?? 0),
      liquidated2: Number(p.liquidated2 ?? 0),
      liquidated3: Number(p.liquidated3 ?? 0),
      status: p.managerApprovalStatus ?? p.status ?? "PENDING",
    }));

    setPlans(mappedPlans);
  };

  const fetchLiquidationPlansInRange = async (from: Date, to: Date) => {
    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");
    const res = await fetchLiquidationPlansByDateRange(managerId, fromStr, toStr);

    const mappedPlans: ManagerLiquidationPlan[] = res.map((p: any) => ({
      ...p,
      id: String(p.id),
      createdAt: new Date(p.createdAt),
      product: p.productName ?? p.product ?? "",
      doctor: p.doctorName ?? p.doctor ?? "",
      productId: p.productId ?? p.productID ?? 0,
      doctorId: p.doctorId ?? p.doctorID ?? 0,
      liquidated1: Number(p.liquidated1 ?? 0),
      liquidated2: Number(p.liquidated2 ?? 0),
      liquidated3: Number(p.liquidated3 ?? 0),
      status: p.managerApprovalStatus ?? p.status ?? "PENDING",
    }));

    setPlans(mappedPlans);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchEmployeesData(),
          fetchLiquidationPlans(),
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      (async () => {
        try {
          setLoading(true);
          await fetchLiquidationPlansInRange(fromDate, toDate);
        } catch (err) {
          console.error("Error fetching manager liquidation plans by date range:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [fromDate, toDate]);

  const filteredPlans = selectedEmployeeId
    ? plans.filter((p) => p.employeeId === selectedEmployeeId)
    : [];

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await updateLiquidationPlanStatus(id, status);

      setPlans((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status } : p
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
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
            <Button variant="ghost" onClick={async () => {
              setFromDate(undefined);
              setToDate(undefined);
              setLoading(true);
              try {
                await fetchLiquidationPlans();
              } catch (err) {
                console.error("Error reloading current month plans:", err);
              } finally {
                setLoading(false);
              }
            }} className="gap-2">
              <X className="h-4 w-4" /> Clear
            </Button>
          </div>

          {/* Employee Selector */}
          <PersonSelector
            persons={employees}
            selectedPersonId={selectedEmployeeId}
            onSelect={setSelectedEmployeeId}
            placeholder="Search team member by name or employee ID..."
          />

          {selectedEmployeeId && !loading && (
            <>
              <StatsCards plans={filteredPlans} />
              <ManagerLiquidationList
                plans={filteredPlans}
                onUpdateStatus={handleUpdateStatus}
              />
            </>
          )}

          {loading && (
            <p className="text-muted-foreground">
              Loading data...
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerStockLiquidation;
