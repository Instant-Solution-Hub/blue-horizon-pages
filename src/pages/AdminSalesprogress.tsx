import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminTerritoryTable from "@/components/admin-sales-progress/AdminTerritoryTable";
import { TerritoryData} from "@/components/admin-sales-progress/AdminTerritoryTable";
import { getTerritoryOverview, getTerritoryTargets } from "@/services/ManagerTargetService";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, TrendingUp, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import AdminFEMarketTable from "@/components/admin-sales-progress/AdminFEMarketTable";
import AdminFEProductTable from "@/components/admin-sales-progress/AdminFEProductTable";
import AdminFEStockistTable from "@/components/admin-sales-progress/AdminFEStockistTable";
import {getAllMonthlyMarketSales, getAllMonthlyProductSales, getAllMonthlyStockistSales,} from "@/services/SalesProgressService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data with manager names
// const feMarketData = [
//   { feName: "Arun Mehta", marketName: "North Region", secondarySales: 45000, date: "2025-06-10" },
//   { feName: "Arun Mehta", marketName: "East Region", secondarySales: 32000, date: "2025-06-11" },
//   { feName: "Deepak Joshi", marketName: "South Region", secondarySales: 58000, date: "2025-06-10" },
//   { feName: "Deepak Joshi", marketName: "West Region", secondarySales: 41000, date: "2025-06-13" },
//   { feName: "Kavita Nair", marketName: "Central Region", secondarySales: 37000, date: "2025-06-09" },
//   { feName: "Kavita Nair", marketName: "North Region", secondarySales: 29000, date: "2025-06-12" },
//   { feName: "Rahul Desai", marketName: "South Region", secondarySales: 62000, date: "2025-06-14" },
//   { feName: "Rahul Desai", marketName: "East Region", secondarySales: 48000, date: "2025-06-08" },
// ];

// const feProductData = [
//   { feName: "Arun Mehta", productName: "Larimar-500", newPTS: 150, qty: 30, sales: 4500, date: "2025-06-10" },
//   { feName: "Arun Mehta", productName: "Larimar-Plus", newPTS: 200, qty: 25, sales: 5000, date: "2025-06-11" },
//   { feName: "Deepak Joshi", productName: "Larimar-D3", newPTS: 100, qty: 40, sales: 4000, date: "2025-06-10" },
//   { feName: "Deepak Joshi", productName: "Larimar-Forte", newPTS: 175, qty: 35, sales: 6125, date: "2025-06-13" },
//   { feName: "Kavita Nair", productName: "Larimar-500", newPTS: 150, qty: 28, sales: 4200, date: "2025-06-09" },
//   { feName: "Kavita Nair", productName: "Larimar-Gel", newPTS: 80, qty: 50, sales: 4000, date: "2025-06-12" },
//   { feName: "Rahul Desai", productName: "Larimar-Plus", newPTS: 200, qty: 45, sales: 9000, date: "2025-06-14" },
//   { feName: "Rahul Desai", productName: "Larimar-Forte", newPTS: 175, qty: 32, sales: 5600, date: "2025-06-08" },
// ];

// const feStockistData = [
//   { feName: "Arun Mehta", feRegion: "North Region", stockistName: "MedPlus Distributors", primarySales: 85000, date: "2025-06-10" },
//   { feName: "Arun Mehta", feRegion: "North Region", stockistName: "HealthCare Traders", primarySales: 62000, date: "2025-06-11" },
//   { feName: "Deepak Joshi", feRegion: "South Region", stockistName: "PharmaCare Agencies", primarySales: 94000, date: "2025-06-10" },
//   { feName: "Deepak Joshi", feRegion: "South Region", stockistName: "Apollo Supply Chain", primarySales: 71000, date: "2025-06-13" },
//   { feName: "Kavita Nair", feRegion: "Central Region", stockistName: "LifeLine Distributors", primarySales: 53000, date: "2025-06-09" },
//   { feName: "Kavita Nair", feRegion: "Central Region", stockistName: "MedPlus Distributors", primarySales: 47000, date: "2025-06-12" },
//   { feName: "Rahul Desai", feRegion: "East Region", stockistName: "HealthCare Traders", primarySales: 78000, date: "2025-06-14" },
//   { feName: "Rahul Desai", feRegion: "East Region", stockistName: "PharmaCare Agencies", primarySales: 66000, date: "2025-06-08" },
// ];



const AdminSalesProgress = () => {

    const [territoryData, setTerritoryData] = useState<TerritoryData[]>([]);
    const [feMarketData, setFeMarketData] = useState<any[]>([]);
const [feProductData, setFeProductData] = useState<any[]>([]);
const [feStockistData, setFeStockistData] = useState<any[]>([]);
    const[loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [managerSearch, setManagerSearch] = useState("");
  const [feSearch, setFeSearch] = useState("");
  const currentYear = new Date().getFullYear();
  const selectedYearNum = selectedYear ? Number(selectedYear) : null;
const selectedMonthNum = selectedMonth ? Number(selectedMonth) + 1 : null;
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

  const loadSalesData = async (year: number, month: number) => {
  try {
    const [marketRes, productRes, stockistRes , territoryRes] = await Promise.all([
      getAllMonthlyMarketSales(year, month),
      getAllMonthlyProductSales(year, month),
      getAllMonthlyStockistSales(year, month),
      getTerritoryOverview(month , year)
    ]);

    setFeMarketData(marketRes ?? []);
    setFeProductData(productRes ?? []);
    setFeStockistData(stockistRes ?? []);
    setTerritoryData(territoryRes ?? []);
  } catch (err) {
    console.error("Failed to load sales data", err);
  }
};

useEffect(() => {
  const initLoad = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const month = now.getMonth() + 1; // getMonth() is 0-indexed
      const year = now.getFullYear();

      await loadSalesData(year, month);

    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  initLoad();
}, []);

useEffect(() => {
  const fetchByDropdown = async () => {
    if (selectedYearNum && selectedMonthNum) {
      await loadSalesData(selectedYearNum, selectedMonthNum);
    }

    // if cleared → load current month
    if (!selectedYear && !selectedMonth) {
      const now = new Date();
      await loadSalesData(now.getFullYear(), now.getMonth() + 1);
    }
  };

  fetchByDropdown();
}, [selectedYear, selectedMonth]);

  const filteredTerritory = useMemo(() => {
  let data = territoryData ?? [];

  if (managerSearch.trim()) {
    const q = managerSearch.toLowerCase();

    data = data.filter((d) =>
      (d.managerName ?? "").toLowerCase().includes(q)
    );
  }

  return data;
}, [territoryData, managerSearch]);

const filteredFEMarket = useMemo(() => {
  let data = feMarketData ?? [];

  if (feSearch.trim()) {
    const q = feSearch.toLowerCase();

    data = data.filter((d) =>
      (d.feName ?? "").toLowerCase().includes(q)
    );
  }

  return [...data].sort((a, b) =>
    (a.feName ?? "").localeCompare(b.feName ?? "")
  );
}, [feSearch, feMarketData]);

 const filteredFEProduct = useMemo(() => {
  let data = feProductData ?? [];

  if (feSearch.trim()) {
    const q = feSearch.toLowerCase();

    data = data.filter((d) =>
      (d.feName ?? "").toLowerCase().includes(q)
    );
  }

  return [...data].sort((a, b) =>
    (a.feName ?? "").localeCompare(b.feName ?? "")
  );
}, [feSearch, feProductData]);

 const filteredFEStockist = useMemo(() => {
  let data = feStockistData ?? [];

  if (feSearch.trim()) {
    const q = feSearch.toLowerCase();

    data = data.filter((d) =>
      (d.feName ?? "").toLowerCase().includes(q)
    );
  }

  return [...data].sort((a, b) =>
    (a.feName ?? "").localeCompare(b.feName ?? "")
  );
}, [feSearch, feStockistData]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto">
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
              View territory-wise target and sales overview across all regions
            </p>
          </div>
              <div className="animate-fade-in flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(selectedYear || selectedMonth) && (
              <Button variant="ghost" onClick={() => { setSelectedYear(""); setSelectedMonth(""); }}>Clear</Button>
            )}
          </div>

          {/* Territory Table Section */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading reports...
            </div>
          ) : (
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
          )}
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
