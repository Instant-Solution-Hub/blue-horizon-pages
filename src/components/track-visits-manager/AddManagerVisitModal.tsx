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
import { DoctorVisitFormManager, ManagerDoctorVisitData } from "./DoctorVisitFormManager";
import { UnscheduledManagerDoctorVisitForm } from "./UnscheduledManagerDoctorVisitForm";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type VisitType = "scheduled" | "unscheduled" | "";

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManagerDoctorVisitData) => void;
  todaysVisits: any[];
  doctors: any[];
  products: any[];
}

export function AddManagerVisitModal({ isOpen, onClose, onSubmit, todaysVisits, products, doctors }: AddVisitModalProps) {
  const [visitType, setVisitType] = useState<VisitType>("");
  const [selectedDoctorDesignation, setSelectedDoctorDesignation] = useState<string>("");
  const navigate = useNavigate();

   const handleClose = () => {
    setVisitType("");
    setSelectedDoctorDesignation("");
    onClose();
  };

  useEffect(() => {
    console.log("Todays Visits in AddVisitModal:", todaysVisits,);
  }, []);

  const handleSubmit = (data: ManagerDoctorVisitData) => {
    onSubmit(data);
    handleClose();
  };

  const handleShowVisualAids = () => {
    if (!selectedDoctorDesignation) {
      alert("Please select a doctor designation first");
      return;
    }

    // Close the modal and navigate to visual aids page
    handleClose();
    navigate(`/visual-aids?designation=${encodeURIComponent(selectedDoctorDesignation)}`);
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

          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={handleShowVisualAids}
              className="mt-2 flex items-center gap-2"
              disabled={!selectedDoctorDesignation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Show Visual Aids {selectedDoctorDesignation ? `(${selectedDoctorDesignation})` : ''}
            </Button>
          </div>


          {visitType === "scheduled" && (
            <DoctorVisitFormManager
            onSubmit={handleSubmit} 
            onCancel={handleClose}
            products={products}
            onDesignationChange={setSelectedDoctorDesignation}
            doctorVisits={todaysVisits} />

          )}

          {visitType === "unscheduled" && (
            <UnscheduledManagerDoctorVisitForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            products={products}
            onDesignationChange={setSelectedDoctorDesignation}
            doctors={doctors} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
