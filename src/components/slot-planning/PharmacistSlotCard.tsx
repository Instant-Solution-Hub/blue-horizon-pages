import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, User, Building2 } from "lucide-react";

interface PharmacistSlotCardProps {
  id: number;
  visitType: "doctor" | "pharmacist";
  pharmacyName: string;
  contactPerson: string;
  canDelete: boolean;
  onDelete: (id: number) => void;
}

const categoryColors: Record<string, string> = {
  A_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-300",
  A: "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-amber-100 text-amber-800 border-amber-300",
};

const practiceTypeLabels: Record<string, string> = {
  RP: "Retail Practice",
  OP: "Own Practice",
  NP: "Nursing Practice",
};

export function PharmacistSlotCard({
  id,
  visitType,
  pharmacyName,
  contactPerson,
//   category,
//   practiceType,
//   specialization,
//   hospitalName,
//   visitTrack,
  canDelete,
  onDelete,
}: PharmacistSlotCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          visitType.toLowerCase() === "doctor" ? "bg-primary" : "bg-violet-500"
        }`}
      />
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-500" />
              <span className="font-semibold">{pharmacyName}</span>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{contactPerson}</span>
            </div>

            {/* <div className="flex flex-wrap gap-2">
              {practiceType && (
                <Badge variant="secondary" className="text-xs">
                  {practiceTypeLabels[practiceType] || practiceType}
                </Badge>
              )}
              {visitTrack && (
                <Badge variant="outline" className="text-xs">
                  {visitTrack}
                </Badge>
              )}
            </div> */}
          </div>

          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
