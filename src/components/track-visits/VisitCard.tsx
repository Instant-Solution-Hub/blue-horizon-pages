import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface BaseVisit {
  id: string;
  visitType: "doctor" | "pharmacist" | "stockist";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
}

interface DoctorVisit extends BaseVisit {
  visitType: "doctor";
  doctorName: string;
  designation: string;
  category: string;
  practiceType: string;
  hospital: string;
  location: { lat: number; lng: number } | null;
}

interface PharmacistVisit extends BaseVisit {
  visitType: "pharmacist";
  pharmacyName: string;
  contactPerson: string;
  contactNumber: string;
}

interface StockistVisit extends BaseVisit {
  visitType: "stockist";
  stockistName: string;
  stockistType: string;
  contactPerson: string;
  contactNumber: string;
  location: { lat: number; lng: number } | null;
  orderValue?: string;
}

type Visit = DoctorVisit | PharmacistVisit | StockistVisit;

interface VisitCardProps {
  visit: Visit;
}

export function VisitCard({ visit }: VisitCardProps) {
  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pharmacist":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "stockist":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderDoctorVisit = (v: DoctorVisit) => (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{v.doctorName}</h3>
          <p className="text-sm text-muted-foreground">{v.designation}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{v.category}</Badge>
          <Badge className={getVisitTypeColor("doctor")}>Doctor</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
        <p><span className="text-muted-foreground">Practice Type:</span> {v.practiceType}</p>
        <p><span className="text-muted-foreground">Hospital:</span> {v.hospital}</p>
      </div>
      {v.location && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <MapPin className="h-3 w-3" />
          <span>Location captured</span>
        </div>
      )}
    </>
  );

  const renderPharmacistVisit = (v: PharmacistVisit) => (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{v.pharmacyName}</h3>
          <p className="text-sm text-muted-foreground">{v.contactPerson}</p>
        </div>
        <Badge className={getVisitTypeColor("pharmacist")}>Pharmacist</Badge>
      </div>
      <div className="text-sm mt-3">
        <p><span className="text-muted-foreground">Contact:</span> {v.contactNumber}</p>
      </div>
    </>
  );

  const renderStockistVisit = (v: StockistVisit) => (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{v.stockistName}</h3>
          <p className="text-sm text-muted-foreground">{v.stockistType}</p>
        </div>
        <Badge className={getVisitTypeColor("stockist")}>Stockist</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
        <p><span className="text-muted-foreground">Contact Person:</span> {v.contactPerson}</p>
        <p><span className="text-muted-foreground">Contact:</span> {v.contactNumber}</p>
      </div>
      {v.orderValue && (
        <p className="text-sm mt-2">
          <span className="text-muted-foreground">Order Value:</span> ₹{v.orderValue}
        </p>
      )}
      {v.location && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <MapPin className="h-3 w-3" />
          <span>Location captured</span>
        </div>
      )}
    </>
  );

  return (
    <Card>
      <CardContent className="pt-4">
        {visit.visitType === "doctor" && renderDoctorVisit(visit as DoctorVisit)}
        {visit.visitType === "pharmacist" && renderPharmacistVisit(visit as PharmacistVisit)}
        {visit.visitType === "stockist" && renderStockistVisit(visit as StockistVisit)}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(visit.dateTime, "dd MMM yyyy, hh:mm a")}</span>
          </div>
          {visit.isMissed && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span>Missed</span>
            </div>
          )}
        </div>

        {visit.activitiesPerformed.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {visit.activitiesPerformed.map((activity) => (
              <Badge key={activity} variant="secondary" className="text-xs">
                {activity}
              </Badge>
            ))}
          </div>
        )}

        {visit.notes && (
          <p className="text-sm text-muted-foreground mt-3 bg-muted p-2 rounded">
            {visit.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
