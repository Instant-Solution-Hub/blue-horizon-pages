import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Edit, Image, Building2, User, Calendar } from "lucide-react";
import { format } from "date-fns";

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

interface ReportListProps {
  reports: CompetitiveReport[];
  onEdit: (report: CompetitiveReport) => void;
}

const ReportList = ({ reports, onEdit }: ReportListProps) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No reports added yet. Click "Add New Report" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{report.brandName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {report.companyName}
                  </Badge>
                  {report.imageUrl && (
                    <Badge variant="secondary" className="text-xs">
                      <Image className="w-3 h-3 mr-1" />
                      Image
                    </Badge>
                  )}
                  {report.managerNotified && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <Bell className="w-3 h-3 mr-1" />
                      Manager Notified
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{report.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{report.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(report.date, "MMM dd, yyyy")}</span>
                  </div>
                  {report.product && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Product:</span> {report.product}
                      {report.productCategory && ` (${report.productCategory})`}
                    </div>
                  )}
                </div>

                {report.observations && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    {report.observations}
                  </p>
                )}

                {report.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={report.imageUrl}
                      alt="Report"
                      className="h-20 w-auto rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(report)}
                className="ml-4"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportList;
