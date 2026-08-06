import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { PackageOpen, Download, X, CalendarIcon } from "lucide-react";
import AdminLiquidationList from "@/components/admin-stock-liquidation/AdminLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";
import { LiquidationPlan } from "@/components/stock-liquidation/AddLiquidationModal";
import { fetchFieldExecutivesBasic } from "@/services/FEService";
import {
  fetchCurrentMonthLiquidationPlans,
  fetchLiquidationPlansByDateRange,
} from "@/services/LiquidationService";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface LiquidationPlanWithMeta extends LiquidationPlan {
  employeeId: number;
}

const AdminStockLiquidation = () => {
  const [employees, setEmployees] = useState<Person[]>([]);
  const [plans, setPlans] = useState<LiquidationPlanWithMeta[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const fetchEmployeesData = async () => {
    const data = await fetchFieldExecutivesBasic();
    setEmployees(
      data.map((employee) => ({
        id: employee.id,
        name: employee.name,
        employeeCode: employee.employeeCode,
        territory: employee.territory,
      }))
    );
  };

  const fetchPlansData = async () => {
    const data = await fetchCurrentMonthLiquidationPlans();

    const mappedPlans: LiquidationPlanWithMeta[] = data.map((plan: any) => ({
      ...plan,
      id: String(plan.id),
      createdAt: new Date(plan.createdAt),
      // map backend names to frontend shape expected by components
      product: plan.productName ?? plan.product ?? "",
      doctor: plan.doctorName ?? plan.doctor ?? "",
      productId: plan.productId ?? plan.productID ?? 0,
      doctorId: plan.doctorId ?? plan.doctorID ?? 0,
      liquidated1: Number(plan.liquidated1 ?? 0),
      liquidated2: Number(plan.liquidated2 ?? 0),
      liquidated3: Number(plan.liquidated3 ?? 0),
      // use managerApprovalStatus if provided by backend
      status: plan.managerApprovalStatus ?? plan.status ?? "PENDING",
      employeeId: plan.employeeId ?? plan.feId ?? plan.fieldExecutiveId ?? 0,
    }));

    setPlans(mappedPlans);
  };

  const fetchPlansByDateRange = async (from: Date, to: Date) => {
    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");
    const data = await fetchLiquidationPlansByDateRange(fromStr, toStr);

    const mappedPlans: LiquidationPlanWithMeta[] = data.map((plan: any) => ({
      ...plan,
      id: String(plan.id),
      createdAt: new Date(plan.createdAt),
      product: plan.productName ?? plan.product ?? "",
      doctor: plan.doctorName ?? plan.doctor ?? "",
      productId: plan.productId ?? plan.productID ?? 0,
      doctorId: plan.doctorId ?? plan.doctorID ?? 0,
      liquidated1: Number(plan.liquidated1 ?? 0),
      liquidated2: Number(plan.liquidated2 ?? 0),
      liquidated3: Number(plan.liquidated3 ?? 0),
      status: plan.managerApprovalStatus ?? plan.status ?? "PENDING",
      employeeId: plan.employeeId ?? plan.feId ?? plan.fieldExecutiveId ?? 0,
    }));

    setPlans(mappedPlans);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEmployeesData(), fetchPlansData()]);
      } catch (err) {
        console.error("Error loading admin liquidation data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // When both dates are present, fetch plans for that date range
  useEffect(() => {
    if (fromDate && toDate) {
      (async () => {
        try {
          setLoading(true);
          await fetchPlansByDateRange(fromDate, toDate);
        } catch (err) {
          console.error("Error fetching plans by date range:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [fromDate, toDate]);

  const filteredPlans = useMemo(() => {
    const base = selectedEmployeeId ? plans.filter((p) => p.employeeId === selectedEmployeeId) : [];
    return base;
  }, [plans, selectedEmployeeId]);

  const handleClear = async () => {
    setFromDate(undefined);
    setToDate(undefined);
    // refetch current month data
    setLoading(true);
    try {
      await fetchPlansData();
    } catch (err) {
      console.error("Error reloading current month plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredPlans.length === 0) return;
    const rows = filteredPlans.map((p) => {
      const l1 = p.liquidated1 ?? 0;
      const l2 = p.liquidated2 ?? 0;
      const l3 = p.liquidated3 ?? 0;
      const total = l1 + l2 + l3;
      const progress = p.targetLiquidation
        ? Math.min(100, Math.round((total / p.targetLiquidation) * 100))
        : 0;
      return {
        Product: p.product,
        Doctor: p.doctor,
        "Available Qty": p.quantity,
        Target: p.targetLiquidation,
        Market: p.marketName,
        "Medical Shop": p.medicalShopName || "-",
        Status: p.status,
        "Block 1 (Day 1-10)": l1,
        "Block 2 (Day 11-20)": l2,
        "Block 3 (Day 21-30)": l3,
        "Total Liquidated": total,
        "Progress %": progress,
        "Created At": format(new Date(p.createdAt), "yyyy-MM-dd"),
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liquidation Plans");
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    XLSX.writeFile(
      wb,
      `stock-liquidation-${emp?.employeeCode ?? "export"}-${format(new Date(), "yyyyMMdd")}.xlsx`
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <PackageOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Stock Liquidation
                </h1>
                <p className="text-muted-foreground mt-1">View liquidation plans of all employees</p>
              </div>
            </div>
            <Button onClick={handleExport} disabled={filteredPlans.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
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

          <PersonSelector
            persons={employees}
            selectedPersonId={selectedEmployeeId}
            onSelect={setSelectedEmployeeId}
            placeholder="Search employee by name or employee ID..."
          />

          {loading && (
            <p className="text-muted-foreground">Loading data...</p>
          )}

          {!loading && selectedEmployeeId && (
            <>
              <StatsCards plans={filteredPlans} />
              <AdminLiquidationList plans={filteredPlans} />
            </>
          )}

          {!loading && !selectedEmployeeId && (
            <p className="text-muted-foreground">
              Select an employee to view current month liquidation plans.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminStockLiquidation;
