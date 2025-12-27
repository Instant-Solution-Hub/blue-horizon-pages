import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DoctorForm from "./DoctorForm";
import { Doctor, DoctorFormData } from "@/hooks/useDoctors";

interface DoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
  onSubmit: (data: DoctorFormData) => void;
  isLoading?: boolean;
}

const DoctorDialog = ({
  open,
  onOpenChange,
  doctor,
  onSubmit,
  isLoading,
}: DoctorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
          <DialogDescription>
            {doctor
              ? "Update the doctor's information below."
              : "Fill in the details to add a new doctor to the system."}
          </DialogDescription>
        </DialogHeader>
        <DoctorForm
          doctor={doctor}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDialog;
