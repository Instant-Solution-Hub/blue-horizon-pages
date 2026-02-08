import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminTerritoryTable from "@/components/admin-sales-progress/AdminTerritoryTable";
import { TerritoryData } from "@/components/admin-sales-progress/AdminTerritoryTable";
import { getTerritoryOverview, getTerritoryTargets } from "@/services/ManagerTargetService";
import { TrendingUp, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data with manager names



const AdminSalesProgress = () => {

    const [territoryData, setTerritoryData] = useState<TerritoryData[]>([]);
    const[loading, setLoading] = useState(true);

     useEffect(() => {
      const loadReports = async () => {
        try {
          setLoading(true);
           const now = new Date();
      const month = now.getMonth() + 1; // 1–12
      const year = now.getFullYear();
    const data = await getTerritoryOverview(month , year);
    setTerritoryData(data);
    setLoading(false);
        } catch (error) {
          console.error("Failed to fetch reports", error);
        }
      };
    
      loadReports();
    }, []);

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
              View territory-wise target and sales overview across all regions
            </p>
          </div>

          {/* Territory Table Section */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading reports...
            </div>
          ) : (
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
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
              <div className="p-4">
                <AdminTerritoryTable data={territoryData} />
              </div>
            </div>
          </div>
          )}
        
        </div>
      </main>
    </div>
  );
};

export default AdminSalesProgress;
