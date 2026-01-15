import Sidebar from "@/components/dashboard/Sidebar";
import ProductSalesTable from "@/components/sales-progress/ProductSalesTable";
import MarketSalesTable from "@/components/sales-progress/MarketSalesTable";

const SalesProgress = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Progress</h1>
            <p className="text-muted-foreground mt-1">
              Manage your individual product sale and market wise sales here
            </p>
          </div>

          {/* Product Sales Section */}
          <ProductSalesTable />

          {/* Market Sales Section */}
          <MarketSalesTable />
        </div>
      </main>
    </div>
  );
};

export default SalesProgress;
