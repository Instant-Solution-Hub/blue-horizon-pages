import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminTerritoryTable from "@/components/admin-sales-progress/AdminTerritoryTable";
import { TrendingUp, MapPin } from "lucide-react";

// Mock data with manager names
const territoryData = [
  {
    territory: "North Region",
    managerName: "Rajesh Kumar",
    primaryTarget: 500000,
    secondaryTarget: 450000,
    weeklyPrimarySale: 320000,
    weeklySecondarySale: 280000,
    totalSubstockistStock: 150000,
  },
  {
    territory: "South Region",
    managerName: "Priya Sharma",
    primaryTarget: 600000,
    secondaryTarget: 550000,
    weeklyPrimarySale: 580000,
    weeklySecondarySale: 520000,
    totalSubstockistStock: 180000,
  },
  {
    territory: "East Region",
    managerName: "Amit Verma",
    primaryTarget: 400000,
    secondaryTarget: 380000,
    weeklyPrimarySale: 250000,
    weeklySecondarySale: 220000,
    totalSubstockistStock: 120000,
  },
  {
    territory: "West Region",
    managerName: "Sneha Patel",
    primaryTarget: 550000,
    secondaryTarget: 500000,
    weeklyPrimarySale: 480000,
    weeklySecondarySale: 450000,
    totalSubstockistStock: 160000,
  },
  {
    territory: "Central Region",
    managerName: "Vikram Singh",
    primaryTarget: 450000,
    secondaryTarget: 420000,
    weeklyPrimarySale: 380000,
    weeklySecondarySale: 350000,
    totalSubstockistStock: 140000,
  },
];

const AdminSalesProgress = () => {
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
        </div>
      </main>
    </div>
  );
};

export default AdminSalesProgress;
