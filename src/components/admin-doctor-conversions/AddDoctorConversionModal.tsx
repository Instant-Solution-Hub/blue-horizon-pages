import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldExecutive } from "@/services/FEService";
import { Doctor } from "@/components/manager-joining/RecordJoiningModal";
import { Product } from "@/services/ProductService";

interface AddDoctorConversionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    fieldExecutiveId: number;
    doctorId: string;
    productId: number;
  }) => void;
  fieldExecutives: FieldExecutive[];
  doctors: Doctor[];
  products: Product[];
  onFEChange: (feId: number) => void; 
}

const AddDoctorConversionModal = ({
  open,
  onOpenChange,
  onAdd,
  fieldExecutives,
  doctors,
  products,
  onFEChange
}: AddDoctorConversionModalProps) => {
  const [formData, setFormData] = useState({
    fieldExecutiveId: "",
    doctorId: "",
    hospitalName: "",
    productId: "",
  });

  const [errors, setErrors] = useState({
    fieldExecutiveId: false,
    doctorId: false,
    productId: false,
  });

  const handleDoctorChange = (value: string) => {
    const selectedDoctor = doctors.find((d) => String(d.id) === value);
    console.log("Selected doctor:", selectedDoctor);
    setFormData({
      ...formData,
      doctorId: value,
      hospitalName: selectedDoctor?.hospitalName || "",
    });
    setErrors({ ...errors, doctorId: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      fieldExecutiveId: !formData.fieldExecutiveId,
      doctorId: !formData.doctorId,
      productId: !formData.productId,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onAdd({
      fieldExecutiveId: Number(formData.fieldExecutiveId),
      doctorId: formData.doctorId,
      productId: Number(formData.productId),
    });

    setFormData({
      fieldExecutiveId: "",
      doctorId: "",
      hospitalName: "",
      productId: "",
    });
    setErrors({
      fieldExecutiveId: false,
      doctorId: false,
      productId: false,
    });
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        fieldExecutiveId: "",
        doctorId: "",
        hospitalName: "",
        productId: "",
      });
      setErrors({
        fieldExecutiveId: false,
        doctorId: false,
        productId: false,
      });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Doctor Conversion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fieldExecutive">Field Executive *</Label>
            <Select
              value={formData.fieldExecutiveId}
              onValueChange={(value) => {
  setFormData({
    ...formData,
    fieldExecutiveId: value,
    doctorId: "",           // reset doctor
    hospitalName: "",       // reset hospital
  });

  setErrors({ ...errors, fieldExecutiveId: false });

  // ✅ fetch doctors for selected FE
  onFEChange(Number(value));
}}

            >
              <SelectTrigger
                className={errors.fieldExecutiveId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select Field Executive" />
              </SelectTrigger>
              <SelectContent>
                {fieldExecutives.map((fe) => (
                  <SelectItem key={fe.id} value={fe.id.toString()}>
                    {fe.name} ({fe.managerName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor *</Label>
           <Select
  value={formData.doctorId}
  onValueChange={handleDoctorChange}
  disabled={!formData.fieldExecutiveId} // ✅ nice UX
>

              <SelectTrigger
                className={errors.doctorId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={String(doctor.id)}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              readOnly
              placeholder="Auto-filled when doctor is selected"
              className="bg-muted cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => {
                setFormData({ ...formData, productId: value });
                setErrors({ ...errors, productId: false });
              }}
            >
              <SelectTrigger
                className={errors.productId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Conversion</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorConversionModal;
