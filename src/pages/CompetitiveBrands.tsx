import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import StatsCards from "@/components/competitive-brands/StatsCards";
import AddReportModal from "@/components/competitive-brands/AddReportModal";
import ReportList from "@/components/competitive-brands/ReportList";

interface CompetitiveReport {
  id: string;
  brandName: string;
  companyName: string;
  product: string;
  productCategory: string;
  doctorName: string;
  hospitalName: string;
  observations: string;
  date: Date;
  imageUrl?: string;
  managerNotified: boolean;
}

const CompetitiveBrands = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<CompetitiveReport | null>(null);
  const [reports, setReports] = useState<CompetitiveReport[]>([
    {
      id: "1",
      brandName: "Competitor X",
      companyName: "PharmaCorp",
      product: "Competitor Drug A",
      productCategory: "Antibiotics",
      doctorName: "Dr. Amit Sharma",
      hospitalName: "City Hospital",
      observations: "New promotional scheme launched with 20% discount",
      date: new Date(2024, 0, 15),
      imageUrl: "",
      managerNotified: true,
    },
    {
      id: "2",
      brandName: "Brand Y",
      companyName: "MediLife",
      product: "Competitor Drug C",
      productCategory: "Cardiovascular",
      doctorName: "Dr. Priya Patel",
      hospitalName: "Apollo Clinic",
      observations: "Aggressive marketing with free samples",
      date: new Date(2024, 0, 18),
      imageUrl: "",
      managerNotified: false,
    },
  ]);

  const handleAddReport = (
    reportData: Omit<CompetitiveReport, "id" | "managerNotified">
  ) => {
    if (editingReport) {
      setReports(
        reports.map((r) =>
          r.id === editingReport.id
            ? { ...r, ...reportData }
            : r
        )
      );
    } else {
      const newReport: CompetitiveReport = {
        ...reportData,
        id: Date.now().toString(),
        managerNotified: false,
      };
      setReports([newReport, ...reports]);
    }
    setEditingReport(null);
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

          <ReportList reports={filteredReports} onEdit={handleEdit} />

          <AddReportModal
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingReport(null);
            }}
            onSubmit={handleAddReport}
            editingReport={editingReport}
          />
        </div>
      </main>
    </div>
  );
};

export default CompetitiveBrands;
