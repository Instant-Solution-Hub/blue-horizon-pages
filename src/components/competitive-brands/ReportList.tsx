import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Edit, Image, Building2, User, Calendar } from "lucide-react";
import { format } from "date-fns";

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

interface ReportListProps {
  reports: CompetitiveReport[];
  onEdit: (report: CompetitiveReport) => void;
}

const ReportList = ({ reports, onEdit }: ReportListProps) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No reports added yet.
      </div>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="relative border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          {/* Soft accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400" />

          <CardContent className="p-5 space-y-4">
            {/* BRAND · COMPANY */}
            <div className="flex items-center gap-2 text-lg">
              <span className="font-semibold text-slate-800">
                {report.brandName}
              </span>
              <span className="text-slate-400 font-semibold">·</span>
              <span className="font-semibold text-slate-700">
                {report.companyName}
              </span>
            </div>

            {/* CATEGORY / PRODUCT */}
            <div className="flex flex-wrap gap-8">
  {/* CATEGORY */}
  <div className="rounded-lg bg-indigo-50 px-4 py-2">
    <span className="text-xs font-semibold text-indigo-600 mr-2">
      CATEGORY
    </span>
    <span className="text-base font-medium text-indigo-900">
      {report.productCategory}
    </span>
  </div>

  {/* PRODUCT */}
  {report.productName && (
    <div className="rounded-lg bg-sky-50 px-4 py-2">
      <span className="text-xs font-semibold text-sky-600 mr-2">
        PRODUCT
      </span>
      <span className="text-base font-medium text-sky-900">
        {report.productName}
      </span>
    </div>
  )}
</div>


            {/* SOURCE · DESIGNATION */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-500" />
                <span className="font-medium">{report.source}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-500" />
                <span>{report.designation}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-500" />
                <span>
                  {format(new Date(report.createdAt), "dd MMM yyyy")}
                </span>
              </div>
            </div>

            {/* OBSERVATIONS */}
            {report.observations && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm text-slate-700 leading-relaxed">
                {report.observations}
              </div>
            )}

            {/* IMAGE */}
            {report.imageUrl && (
              <div className="pt-2">
               <img
  src={`${API_BASE_URL}${report.imageUrl}`}
  alt="Report"
  className="h-28 w-auto rounded-lg border object-cover"
/>
              </div>
            )}

            {/* EDIT */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(report)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default ReportList;
