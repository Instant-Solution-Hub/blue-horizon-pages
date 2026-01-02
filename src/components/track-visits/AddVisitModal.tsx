import { useState } from "react";
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
import { DoctorVisitForm, DoctorVisitData } from "./DoctorVisitForm";
import { PharmacistVisitForm, PharmacistVisitData } from "./PharmacistVisitForm";
import { StockistVisitForm, StockistVisitData } from "./StockistVisitForm";

type VisitType = "doctor" | "pharmacist" | "stockist" | "";

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorVisitData | PharmacistVisitData | StockistVisitData) => void;
}

export function AddVisitModal({ isOpen, onClose, onSubmit }: AddVisitModalProps) {
  const [visitType, setVisitType] = useState<VisitType>("");

  const handleClose = () => {
    setVisitType("");
    onClose();
  };

  const handleSubmit = (data: DoctorVisitData | PharmacistVisitData | StockistVisitData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Visit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Visit Type</Label>
            <Select value={visitType} onValueChange={(value) => setVisitType(value as VisitType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="pharmacist">Pharmacist/Chemist Visit</SelectItem>
                <SelectItem value="stockist">Stockist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visitType === "doctor" && (
            <DoctorVisitForm onSubmit={handleSubmit} onCancel={handleClose} />
          )}

          {visitType === "pharmacist" && (
            <PharmacistVisitForm onSubmit={handleSubmit} onCancel={handleClose} />
          )}

          {visitType === "stockist" && (
            <StockistVisitForm onSubmit={handleSubmit} onCancel={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
