import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DoctorVisitForm, DoctorVisitData } from "../track-visits/DoctorVisitForm";
import { StockistVisitData } from "../track-visits/StockistVisitForm";
import { PharmacistVisitData } from "../track-visits/PharmacistVisitForm";
import { DoctorVisitFormManager,  ManagerDoctorVisitData } from "./DoctorVisitFormManager";
import { UnscheduledManagerDoctorVisitForm } from "./UnscheduledManagerDoctorVisitForm";

type VisitType = "scheduled" | "unscheduled" |"";

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManagerDoctorVisitData) => void;
  todaysVisits: any[];
  doctors: any[];
  products: any[];
}

export function AddManagerVisitModal({ isOpen, onClose, onSubmit, todaysVisits, products, doctors}: AddVisitModalProps) {
  const [visitType, setVisitType] = useState<VisitType>("");

  const handleClose = () => {
    setVisitType("");
    onClose();
  };

  useEffect(() => {
console.log("Todays Visits in AddVisitModal:", todaysVisits,);
    }, []);

  const handleSubmit = (data: ManagerDoctorVisitData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Visit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Visit Type</Label>
            <Select value={visitType} onValueChange={(value) => setVisitType(value as VisitType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="unscheduled">Unscheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {visitType === "scheduled" && (
            <DoctorVisitFormManager onSubmit={handleSubmit} onCancel={handleClose} products={products} doctorVisits={todaysVisits} />

          )}

          {visitType === "unscheduled" && (
            <UnscheduledManagerDoctorVisitForm onSubmit={handleSubmit} onCancel={handleClose} products={products} doctors={doctors} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
