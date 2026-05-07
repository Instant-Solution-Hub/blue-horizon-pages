
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {  TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminFEMarketTable from "@/components/admin-sales-progress/AdminFEMarketTable";
import AdminFEProductTable from "@/components/admin-sales-progress/AdminFEProductTable";
import AdminFEStockistTable from "@/components/admin-sales-progress/AdminFEStockistTable";
import {getAllMonthlyMarketSales, getAllMonthlyProductSales, getAllMonthlyStockistSales, getManagerMonthlyMarketSales, getManagerMonthlyProductSales, getManagerMonthlyStockistSales,} from "@/services/SalesProgressService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";



const ManagerSalesProgress = () => {

   
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

const selectedMonthNum =
  selectedMonth !== ""
    ? ((Number(selectedMonth) + 1) % 12) + 1
    : null;

const adjustedYear =
  selectedYearNum && selectedMonth !== ""
    ? selectedYearNum + (Number(selectedMonth) === 11 ? 1 : 0)
    : null;
    
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const managerId = Number(sessionStorage.getItem("userID"));

  const loadSalesData = async (year: number, month: number) => {
  try {
    const [marketRes, productRes, stockistRes] = await Promise.all([
      getManagerMonthlyMarketSales(managerId,year, month),
      getManagerMonthlyProductSales(managerId,year, month),
      getManagerMonthlyStockistSales(managerId,year, month),
      
    ]);

    setFeMarketData(marketRes ?? []);
    setFeProductData(productRes ?? []);
    setFeStockistData(stockistRes ?? []);
    
  } catch (err) {
    console.error("Failed to load sales data", err);
  }
};


const handleMarketExport = () => {
  if (!filteredFEMarket || filteredFEMarket.length === 0) return;

  const exportData = filteredFEMarket.map((row) => ({
    "Field Executive": row.feName,
    "Market": row.market,
    "Sec Sales": row.salesAmount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Market Sales");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Market_Sales.xlsx");
};

const handleProductExport = () => {
  if (!filteredFEProduct || filteredFEProduct.length === 0) return;

  const exportData = filteredFEProduct.map((row) => ({
    "Field Executive": row.feName,
    "Product": row.productName,
    "New PTS": row.pts,
    "Qty": row.quantity,
    "Sales": row.sales,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Product Sales");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Product_Sales.xlsx");
};

const handleStockistExport = () => {
  if (!filteredFEStockist || filteredFEStockist.length === 0) return;

  const exportData = filteredFEStockist.map((row) => ({
    "Field Executive": row.feName,
    "Stockist": row.stockistName,
    "Pri Sales": row.price,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Stockist Sales");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Stockist_Sales.xlsx");
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
      await loadSalesData(adjustedYear!, selectedMonthNum!);
    }

    // if cleared → load current month
    if (!selectedYear && !selectedMonth) {
      const now = new Date();
      await loadSalesData(now.getFullYear(), now.getMonth() + 1);
    }
  };

  fetchByDropdown();
}, [selectedYear, selectedMonth]);



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
      <ManagerSidebar />
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
              View sales overview of team members across all regions
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

        
              <div className="animate-fade-in space-y-4" style={{ animationDelay: "0.2s" }}>
           <div className="flex items-center justify-between gap-3 flex-wrap">
  
  {/* Search */}
  <div className="relative max-w-sm w-full sm:w-auto">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search by FE name..."
      value={feSearch}
      onChange={(e) => setFeSearch(e.target.value)}
      className="pl-9"
    />
  </div>

  {/* Export Button */}
  <Button size="sm" variant="outline" onClick={handleMarketExport}>
    Export Excel
  </Button>

</div>

            <AdminFEMarketTable data={filteredFEMarket} />
            <div className="flex items-center justify-end">
  <Button size="sm" variant="outline" onClick={handleProductExport}>
    Export Excel
  </Button>
</div>
            <AdminFEProductTable data={filteredFEProduct} />

            <div className="flex items-center justify-end">
  <Button size="sm" variant="outline" onClick={handleStockistExport}>
    Export Excel
  </Button>
</div>
            <AdminFEStockistTable data={filteredFEStockist} />
          </div>
        
        </div>
      </main>
        
    </div>
  );
};

export default ManagerSalesProgress;
