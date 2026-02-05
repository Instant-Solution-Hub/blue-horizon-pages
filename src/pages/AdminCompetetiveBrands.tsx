import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import StatsCards from "@/components/competitive-brands/StatsCards";
import ReportList from "@/components/competitive-brands/ReportList";
import { fetchCompetitiveReports } from "@/services/CompetetivebrandService";
import { toast } from "sonner";


interface CompetitiveReport {
  id: number;
  brandName: string;
  companyName: string;
  productName?: string;
  productCategory: string;
  source: string;
  designation: string;
  observations?: string;
  imageUrl?: string;
  managerNotified: boolean;
  createdAt:string;
  
}


const CompetitiveBrands = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<CompetitiveReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadReports = async () => {
    try {
      setLoading(true);
const data = await fetchCompetitiveReports();
setReports(data);
setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  loadReports();
}, []);


  const filteredReports = reports.filter(
    (report) =>
      report.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReports = reports.length;
  const withImages = reports.filter((r) => r.imageUrl).length;
  const managerNotified = reports.filter((r) => r.managerNotified).length;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Competitive Brands</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track competitive brand activities and promotions, add images for better convenience
            </p>
          </div>

          <StatsCards
            totalReports={totalReports}
            withImages={withImages}
            managerNotified={managerNotified}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by brand or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {loading ? (
  <div className="text-center py-12 text-muted-foreground">
    Loading reports...
  </div>
) : (
  <ReportList reports={filteredReports} onEdit={null} />
)}

          </div>
        </main>
      </div>
    </div>
  );
};

export default CompetitiveBrands;
