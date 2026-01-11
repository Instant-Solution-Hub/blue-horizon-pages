import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import StatsCards from "@/components/competitive-brands/StatsCards";
import AddReportModal from "@/components/competitive-brands/AddReportModal";
import ReportList from "@/components/competitive-brands/ReportList";
import { createCompetitiveReport ,updateCompetitiveReport ,fetchCompetitiveReportsByFE } from "@/services/CompetetivebrandService";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<CompetitiveReport | null>(null);
  const [reports, setReports] = useState<CompetitiveReport[]>([]);
  const fieldExecutiveId = Number(localStorage.getItem("feId")) || 1;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadReports = async () => {
    try {
      setLoading(true);
const data = await fetchCompetitiveReportsByFE(fieldExecutiveId);
setReports(data);
setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  loadReports();
}, [fieldExecutiveId]);

 const handleAddReport = async ({
  data,
  image,
}: {
  data: any;
  image?: File | null;
}) => {
  try {
    const saved = await createCompetitiveReport(data, image);

    setReports((prev) => [saved, ...prev]);
    setIsModalOpen(false);
    setEditingReport(null);
  } catch (error) {
    console.error("Failed to create report", error);
    const message =
    error?.response?.data?.message ||
    "Upload failed. Please try again.";

  toast.error(message);
  }
};

const handleUpdateReport = async (
  id: number,
  {
    data,
    image,
  }: {
    data: any;
    image?: File | null;
  }
) => {
  try {
    const updated = await updateCompetitiveReport(id, data, image);

    setReports((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );

    setIsModalOpen(false);
    setEditingReport(null);
  } catch (error) {
    console.error("Failed to update report", error);
     const message =
    error?.response?.data?.message ||
    "Upload failed. Please try again.";

  toast.error(message);
  }
};



  const handleEdit = (report: CompetitiveReport) => {
    setEditingReport(report);
    setIsModalOpen(true);
  };

  const filteredReports = reports.filter(
    (report) =>
      report.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReports = reports.length;
  const withImages = reports.filter((r) => r.imageUrl).length;
  const managerNotified = reports.filter((r) => r.managerNotified).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Report
            </Button>
          </div>
          {loading ? (
  <div className="text-center py-12 text-muted-foreground">
    Loading reports...
  </div>
) : (
  <ReportList reports={filteredReports} onEdit={handleEdit} />
)}

          

          <AddReportModal
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingReport(null);
            }}
           onSubmit={(payload) => {
    if (editingReport) {
      handleUpdateReport(editingReport.id, payload);
    } else {
      handleAddReport(payload);
    }
  }}
            editingReport={editingReport}
          />
        </div>
      </main>
    </div>
  );
};

export default CompetitiveBrands;
