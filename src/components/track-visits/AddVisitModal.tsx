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
import { Button } from "@/components/ui/button";
import { DoctorVisitForm, DoctorVisitData } from "./DoctorVisitForm";
import { PharmacistVisitForm, PharmacistVisitData } from "./PharmacistVisitForm";
import { StockistVisitForm, StockistVisitData } from "./StockistVisitForm";
import { useNavigate } from "react-router-dom";

type VisitType = "doctor" | "pharmacist" | "stockist" | "";

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorVisitData | PharmacistVisitData | StockistVisitData) => void;
  todaysVisits: any[];
  stockists: any[];
  products: any[];
}

export function AddVisitModal({ isOpen, onClose, onSubmit, todaysVisits, stockists, products }: AddVisitModalProps) {
  const navigate = useNavigate();
  const [visitType, setVisitType] = useState<VisitType>("");
  const [selectedDoctorDesignation, setSelectedDoctorDesignation] = useState<string>("");

  const handleClose = () => {
    setVisitType("");
    setSelectedDoctorDesignation("");
    onClose();
  };

  useEffect(() => {
    console.log("Todays Visits in AddVisitModal:", todaysVisits);
  }, []);

  const handleSubmit = (data: DoctorVisitData | PharmacistVisitData | StockistVisitData) => {
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
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="pharmacist">Pharmacist/Chemist Visit</SelectItem>
                <SelectItem value="stockist">Stockist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visitType === "doctor" && (
            
            <div className="space-y-4">
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
              <DoctorVisitForm 
                onSubmit={handleSubmit} 
                onCancel={handleClose} 
                products={products} 
                doctorVisits={todaysVisits.filter((visit) => visit.visitType.toLowerCase() === "doctor")}
                onDesignationChange={setSelectedDoctorDesignation}
              />
              
             
            </div>
          )}

          {visitType === "pharmacist" && (
            <PharmacistVisitForm onSubmit={handleSubmit} onCancel={handleClose} pharmacistVisits={todaysVisits.filter((visit) => visit.visitType.toLowerCase() === "pharmacist")} />
          )}

          {visitType === "stockist" && (
            <StockistVisitForm onSubmit={handleSubmit} onCancel={handleClose} stockists={stockists} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}