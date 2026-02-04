import Sidebar from "@/components/dashboard/Sidebar";
import ProductSalesTable from "@/components/sales-progress/ProductSalesTable";
import MarketSalesTable from "@/components/sales-progress/MarketSalesTable";
import { BarChart3 } from "lucide-react";

export const SalesProgress = () => {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Sales Progress</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Manage your individual product sale and market wise sales here
            </p>
          </div>

          {/* Product Sales Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <ProductSalesTable />
          </div>

          {/* Market Sales Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <MarketSalesTable />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default SalesProgress;
