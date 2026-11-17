import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import AdminTerritoryTable, { type TerritoryData } from "@/components/admin-sales-progress/AdminTerritoryTable";
import SuperAdminMarketSalesTable from "@/components/super-admin-sales-progress/SuperAdminMarketSalesTable";
import CompanyTargetSection from "@/components/super-admin-sales-progress/CompanyTargetSection";
import { TrendingUp, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getTerritoryOverview } from "@/services/ManagerTargetService";
import { getAllMonthlyMarketSales } from "@/services/SalesProgressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SuperAdminSalesProgress = () => {
  const [territoryData, setTerritoryData] = useState<TerritoryData[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [managerSearch, setManagerSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");

  const currentYear = new Date().getFullYear();
  const selectedYearNum = selectedYear ? Number(selectedYear) : null;
  const selectedMonthNum = selectedMonth !== "" ? ((Number(selectedMonth) + 1) % 12) + 1 : null;
  const adjustedYear = selectedYearNum && selectedMonth !== "" ? selectedYearNum + (Number(selectedMonth) === 11 ? 1 : 0) : null;
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const loadSalesData = async (year: number, month: number) => {
    try {
      const [territoryRes, marketRes] = await Promise.all([
        getTerritoryOverview(month, year),
        getAllMonthlyMarketSales(year, month),
      ]);

      setTerritoryData(territoryRes ?? []);
      setMarketData(marketRes ?? []);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        await loadSalesData(year, month);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    initLoad();
  }, []);

  useEffect(() => {
    const fetchByDropdown = async () => {
      if (selectedYearNum && selectedMonthNum) {
        await loadSalesData(adjustedYear!, selectedMonthNum!);
      }

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
      data = data.filter((d) => (d.managerName ?? "").toLowerCase().includes(q));
    }

    return data;
  }, [territoryData, managerSearch]);

  const filteredMarketData = useMemo(() => {
    let data = marketData ?? [];

    if (marketSearch.trim()) {
      const q = marketSearch.toLowerCase();
      data = data.filter(
        (d) =>
          (d.feName ?? d.managerName ?? "").toLowerCase().includes(q) ||
          (d.market ?? d.marketName ?? "").toLowerCase().includes(q)
      );
    }

    return [...data].sort((a, b) =>
      ((a.feName ?? a.managerName ?? "")).localeCompare(b.feName ?? b.managerName ?? "")
    );
  }, [marketData, marketSearch]);

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Sales Progress</h1>
            </div>
            <p className="text-white/80 ml-14">
              View territory-wise and market-wise sales overview across all regions
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
              <Button variant="ghost" onClick={() => { setSelectedYear(""); setSelectedMonth(""); }}>
                Clear
              </Button>
            )}
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CompanyTargetSection />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Territory-wise Target and Sales Overview
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Monitor targets, sales, and deficits across all territories
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="relative max-w-sm w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by manager name..."
                      value={managerSearch}
                      onChange={(e) => setManagerSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
                ) : (
                  <AdminTerritoryTable data={filteredTerritory} />
                )}
              </div>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="relative max-w-sm w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by FE name..."
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <SuperAdminMarketSalesTable data={filteredMarketData} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminSalesProgress;
