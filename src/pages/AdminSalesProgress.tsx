import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, TrendingUp, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminTerritoryTable from "@/components/admin-sales-progress/AdminTerritoryTable";
import AdminFEMarketTable from "@/components/admin-sales-progress/AdminFEMarketTable";
import AdminFEProductTable from "@/components/admin-sales-progress/AdminFEProductTable";
import AdminFEStockistTable from "@/components/admin-sales-progress/AdminFEStockistTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Territory mock data
const territoryData = [
  { territory: "North Region", managerName: "Rajesh Kumar", primaryTarget: 500000, secondaryTarget: 450000, weeklyPrimarySale: 320000, weeklySecondarySale: 280000, totalSubstockistStock: 150000, date: "2025-06-10" },
  { territory: "South Region", managerName: "Priya Sharma", primaryTarget: 600000, secondaryTarget: 550000, weeklyPrimarySale: 580000, weeklySecondarySale: 520000, totalSubstockistStock: 180000, date: "2025-06-12" },
  { territory: "East Region", managerName: "Amit Verma", primaryTarget: 400000, secondaryTarget: 380000, weeklyPrimarySale: 250000, weeklySecondarySale: 220000, totalSubstockistStock: 120000, date: "2025-06-08" },
  { territory: "West Region", managerName: "Sneha Patel", primaryTarget: 550000, secondaryTarget: 500000, weeklyPrimarySale: 480000, weeklySecondarySale: 450000, totalSubstockistStock: 160000, date: "2025-06-15" },
  { territory: "Central Region", managerName: "Vikram Singh", primaryTarget: 450000, secondaryTarget: 420000, weeklyPrimarySale: 380000, weeklySecondarySale: 350000, totalSubstockistStock: 140000, date: "2025-06-11" },
];

// FE-level mock data
const feMarketData = [
  { feName: "Arun Mehta", marketName: "North Region", secondarySales: 45000, date: "2025-06-10" },
  { feName: "Arun Mehta", marketName: "East Region", secondarySales: 32000, date: "2025-06-11" },
  { feName: "Deepak Joshi", marketName: "South Region", secondarySales: 58000, date: "2025-06-10" },
  { feName: "Deepak Joshi", marketName: "West Region", secondarySales: 41000, date: "2025-06-13" },
  { feName: "Kavita Nair", marketName: "Central Region", secondarySales: 37000, date: "2025-06-09" },
  { feName: "Kavita Nair", marketName: "North Region", secondarySales: 29000, date: "2025-06-12" },
  { feName: "Rahul Desai", marketName: "South Region", secondarySales: 62000, date: "2025-06-14" },
  { feName: "Rahul Desai", marketName: "East Region", secondarySales: 48000, date: "2025-06-08" },
];

const feProductData = [
  { feName: "Arun Mehta", productName: "Larimar-500", newPTS: 150, qty: 30, sales: 4500, date: "2025-06-10" },
  { feName: "Arun Mehta", productName: "Larimar-Plus", newPTS: 200, qty: 25, sales: 5000, date: "2025-06-11" },
  { feName: "Deepak Joshi", productName: "Larimar-D3", newPTS: 100, qty: 40, sales: 4000, date: "2025-06-10" },
  { feName: "Deepak Joshi", productName: "Larimar-Forte", newPTS: 175, qty: 35, sales: 6125, date: "2025-06-13" },
  { feName: "Kavita Nair", productName: "Larimar-500", newPTS: 150, qty: 28, sales: 4200, date: "2025-06-09" },
  { feName: "Kavita Nair", productName: "Larimar-Gel", newPTS: 80, qty: 50, sales: 4000, date: "2025-06-12" },
  { feName: "Rahul Desai", productName: "Larimar-Plus", newPTS: 200, qty: 45, sales: 9000, date: "2025-06-14" },
  { feName: "Rahul Desai", productName: "Larimar-Forte", newPTS: 175, qty: 32, sales: 5600, date: "2025-06-08" },
];

const feStockistData = [
  { feName: "Arun Mehta", stockistName: "MedPlus Distributors", primarySales: 85000, date: "2025-06-10" },
  { feName: "Arun Mehta", stockistName: "HealthCare Traders", primarySales: 62000, date: "2025-06-11" },
  { feName: "Deepak Joshi", stockistName: "PharmaCare Agencies", primarySales: 94000, date: "2025-06-10" },
  { feName: "Deepak Joshi", stockistName: "Apollo Supply Chain", primarySales: 71000, date: "2025-06-13" },
  { feName: "Kavita Nair", stockistName: "LifeLine Distributors", primarySales: 53000, date: "2025-06-09" },
  { feName: "Kavita Nair", stockistName: "MedPlus Distributors", primarySales: 47000, date: "2025-06-12" },
  { feName: "Rahul Desai", stockistName: "HealthCare Traders", primarySales: 78000, date: "2025-06-14" },
  { feName: "Rahul Desai", stockistName: "PharmaCare Agencies", primarySales: 66000, date: "2025-06-08" },
];

const AdminSalesProgress = () => {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [managerSearch, setManagerSearch] = useState("");
  const [feSearch, setFeSearch] = useState("");

  const dateFilter = <T extends { date: string }>(items: T[]) => {
    return items.filter((item) => {
      const d = new Date(item.date);
      if (fromDate && d < fromDate) return false;
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  };

  const filteredTerritory = useMemo(() => {
    let data = dateFilter(territoryData);
    if (managerSearch.trim()) {
      const q = managerSearch.toLowerCase();
      data = data.filter((d) => d.managerName.toLowerCase().includes(q));
    }
    return data;
  }, [fromDate, toDate, managerSearch]);

  const filteredFEMarket = useMemo(() => {
    let data = dateFilter(feMarketData);
    if (feSearch.trim()) {
      const q = feSearch.toLowerCase();
      data = data.filter((d) => d.feName.toLowerCase().includes(q));
    }
    return data.sort((a, b) => a.feName.localeCompare(b.feName));
  }, [fromDate, toDate, feSearch]);

  const filteredFEProduct = useMemo(() => {
    let data = dateFilter(feProductData);
    if (feSearch.trim()) {
      const q = feSearch.toLowerCase();
      data = data.filter((d) => d.feName.toLowerCase().includes(q));
    }
    return data.sort((a, b) => a.feName.localeCompare(b.feName));
  }, [fromDate, toDate, feSearch]);

  const filteredFEStockist = useMemo(() => {
    let data = dateFilter(feStockistData);
    if (feSearch.trim()) {
      const q = feSearch.toLowerCase();
      data = data.filter((d) => d.feName.toLowerCase().includes(q));
    }
    return data.sort((a, b) => a.feName.localeCompare(b.feName));
  }, [fromDate, toDate, feSearch]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Sales Progress</h1>
            </div>
            <p className="text-white/80 ml-14">
              View territory-wise and FE-wise sales overview across all regions
            </p>
          </div>

          {/* Date Range Pickers */}
          <div className="animate-fade-in flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="space-y-1">
              <Label className="text-sm">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            {(fromDate || toDate) && (
              <Button variant="ghost" onClick={() => { setFromDate(undefined); setToDate(undefined); }}>Clear</Button>
            )}
          </div>

          {/* Manager Search + Territory Table */}
          <div className="animate-fade-in space-y-3" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Territory-wise Target and Sales Overview</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Monitor targets, sales, and deficits across all territories</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by manager name..."
                    value={managerSearch}
                    onChange={(e) => setManagerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <AdminTerritoryTable data={filteredTerritory} />
              </div>
            </div>
          </div>

          {/* FE Search + Three FE Tables */}
          <div className="animate-fade-in space-y-4" style={{ animationDelay: "0.2s" }}>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by FE name..."
                value={feSearch}
                onChange={(e) => setFeSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <AdminFEMarketTable data={filteredFEMarket} />
            <AdminFEProductTable data={filteredFEProduct} />
            <AdminFEStockistTable data={filteredFEStockist} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSalesProgress;
