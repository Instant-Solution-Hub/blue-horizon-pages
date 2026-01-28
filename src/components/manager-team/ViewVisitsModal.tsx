import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Stethoscope } from "lucide-react";

interface Visit {
  id: string;
  doctorName: string;
  specialization: string;
  location: string;
  time: string;
  status: "completed" | "pending" | "missed";
}

interface ViewVisitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  visits: Visit[];
}

const ViewVisitsModal = ({ isOpen, onClose, memberName, visits }: ViewVisitsModalProps) => {
  const getStatusBadge = (status: Visit["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case "missed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Missed</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {memberName}'s Visits Today
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {visits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No visits scheduled for today
            </div>
          ) : (
            visits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-lg border border-border bg-muted/30 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{visit.doctorName}</span>
                  </div>
                  {getStatusBadge(visit.status)}
                </div>

                <div className="text-sm text-muted-foreground">
                  {visit.specialization}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {visit.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {visit.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVisitsModal;
