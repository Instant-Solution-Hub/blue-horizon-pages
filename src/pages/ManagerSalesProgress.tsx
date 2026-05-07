import { useState, useMemo } from "react";
import { format } from "date-fns";
import { BarChart3, CalendarIcon, ArrowLeft, User, Package, MapPin, Store } from "lucide-react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProductSale {
  productName: string;
  newPTS: number;
  qty: number;
  sales: number;
  date: string;
}
interface MarketSale {
  marketName: string;
  secondarySales: number;
  date: string;
}
interface StockistSale {
  stockistName: string;
  primarySales: number;
  date: string;
}

interface FE {
  id: string;
  name: string;
  market: string;
  headquarters: string;
  products: ProductSale[];
  markets: MarketSale[];
  stockists: StockistSale[];
}

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - offset);
  return dt.toISOString().slice(0, 10);
};

const mockFEs: FE[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    market: "Mumbai",
    headquarters: "Andheri West",
    products: [
      { productName: "Larimar-500", newPTS: 150, qty: 60, sales: 9000, date: d(2) },
      { productName: "Larimar-Plus", newPTS: 200, qty: 45, sales: 9000, date: d(5) },
      { productName: "Larimar-D3", newPTS: 100, qty: 80, sales: 8000, date: d(10) },
    ],
    markets: [
      { marketName: "Andheri West", secondarySales: 65000, date: d(2) },
      { marketName: "Bandra", secondarySales: 48000, date: d(7) },
    ],
    stockists: [
      { stockistName: "MedPlus Distributors", primarySales: 125000, date: d(3) },
      { stockistName: "HealthCare Traders", primarySales: 88000, date: d(12) },
    ],
  },
  {
    id: "2",
    name: "Priya Desai",
    market: "Mumbai",
    headquarters: "Borivali",
    products: [
      { productName: "Larimar-Forte", newPTS: 175, qty: 50, sales: 8750, date: d(1) },
      { productName: "Larimar-Gel", newPTS: 80, qty: 100, sales: 8000, date: d(8) },
    ],
    markets: [
      { marketName: "Borivali", secondarySales: 72000, date: d(4) },
      { marketName: "Malad", secondarySales: 54000, date: d(11) },
    ],
    stockists: [
      { stockistName: "PharmaCare Agencies", primarySales: 110000, date: d(6) },
    ],
  },
  {
    id: "3",
    name: "Amit Verma",
    market: "Pune",
    headquarters: "Koregaon Park",
    products: [
      { productName: "Larimar-500", newPTS: 150, qty: 90, sales: 13500, date: d(3) },
      { productName: "Larimar-Plus", newPTS: 200, qty: 60, sales: 12000, date: d(9) },
    ],
    markets: [
      { marketName: "Koregaon Park", secondarySales: 95000, date: d(3) },
      { marketName: "Kalyani Nagar", secondarySales: 60000, date: d(13) },
    ],
    stockists: [
      { stockistName: "Apollo Supply Chain", primarySales: 142000, date: d(5) },
    ],
  },
];

const ManagerSalesProgress = () => {
  const [selectedFE, setSelectedFE] = useState<FE | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const inRange = (dateStr: string) => {
    const dt = new Date(dateStr);
    if (fromDate && dt < new Date(fromDate.toDateString())) return false;
    if (toDate && dt > new Date(toDate.toDateString())) return false;
    return true;
  };

  const filteredProducts = useMemo(
    () => (selectedFE ? selectedFE.products.filter((p) => inRange(p.date)) : []),
    [selectedFE, fromDate, toDate]
  );
  const filteredMarkets = useMemo(
    () => (selectedFE ? selectedFE.markets.filter((m) => inRange(m.date)) : []),
    [selectedFE, fromDate, toDate]
  );
  const filteredStockists = useMemo(
    () => (selectedFE ? selectedFE.stockists.filter((s) => inRange(s.date)) : []),
    [selectedFE, fromDate, toDate]
  );

  const clearDates = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerHeader />
        <main className="flex-1 p-6 overflow-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sales Progress</h1>
              <p className="text-muted-foreground text-sm">
                {selectedFE
                  ? `Viewing sales reports for ${selectedFE.name}`
                  : "Select a Field Executive to view their sales reports"}
              </p>
            </div>
          </div>

          {!selectedFE ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFEs.map((fe) => (
                <Card
                  key={fe.id}
                  onClick={() => setSelectedFE(fe)}
                  className="cursor-pointer border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all"
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{fe.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {fe.market} • {fe.headquarters}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Back & Filters */}
              <div className="flex flex-wrap items-end gap-3">
                <Button variant="outline" onClick={() => { setSelectedFE(null); clearDates(); }}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to FE List
                </Button>

                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button variant="ghost" onClick={clearDates}>Clear Dates</Button>
              </div>

              {/* Product Sales */}
              <Card className="border border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><Package className="h-5 w-5 text-primary" /></div>
                    <CardTitle className="text-lg">Individual Product Sales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredProducts.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No data available.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                          <TableHead className="w-16 text-primary font-semibold">SL.NO</TableHead>
                          <TableHead className="text-primary font-semibold">Product Name</TableHead>
                          <TableHead className="text-primary font-semibold">New PTS (₹)</TableHead>
                          <TableHead className="text-primary font-semibold">Qty</TableHead>
                          <TableHead className="text-primary font-semibold">Sales (₹)</TableHead>
                          <TableHead className="text-primary font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((p, i) => (
                          <TableRow key={i} className="hover:bg-primary/5 border-b border-primary/10">
                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                            <TableCell className="font-medium">{p.productName}</TableCell>
                            <TableCell className="text-muted-foreground">₹{p.newPTS.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold text-primary">{p.qty}</TableCell>
                            <TableCell className="font-semibold text-green-600">₹{p.sales.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{p.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Market Sales */}
              <Card className="border border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><MapPin className="h-5 w-5 text-primary" /></div>
                    <CardTitle className="text-lg">Market Wise Sales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredMarkets.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No data available.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                          <TableHead className="w-16 text-primary font-semibold">SL.NO</TableHead>
                          <TableHead className="text-primary font-semibold">Market</TableHead>
                          <TableHead className="text-primary font-semibold">Secondary Sales (₹)</TableHead>
                          <TableHead className="text-primary font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMarkets.map((m, i) => (
                          <TableRow key={i} className="hover:bg-primary/5 border-b border-primary/10">
                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                            <TableCell className="font-medium">{m.marketName}</TableCell>
                            <TableCell className="font-semibold text-green-600">₹{m.secondarySales.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{m.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Stockist Sales */}
              <Card className="border border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><Store className="h-5 w-5 text-primary" /></div>
                    <CardTitle className="text-lg">Stockist Wise Sales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredStockists.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No data available.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                          <TableHead className="w-16 text-primary font-semibold">SL.NO</TableHead>
                          <TableHead className="text-primary font-semibold">Stockist Name</TableHead>
                          <TableHead className="text-primary font-semibold">Primary Sales (₹)</TableHead>
                          <TableHead className="text-primary font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStockists.map((s, i) => (
                          <TableRow key={i} className="hover:bg-primary/5 border-b border-primary/10">
                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                            <TableCell className="font-medium">{s.stockistName}</TableCell>
                            <TableCell className="font-semibold text-green-600">₹{s.primarySales.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{s.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerSalesProgress;
