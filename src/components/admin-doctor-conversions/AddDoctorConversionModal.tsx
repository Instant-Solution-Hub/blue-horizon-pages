import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldExecutive, Doctor, Product } from "@/pages/AdminDoctorConversions";

interface AddDoctorConversionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    fieldExecutiveId: string;
    doctorId: string;
    productId: string;
  }) => void;
  fieldExecutives: FieldExecutive[];
  doctors: Doctor[];
  products: Product[];
}

const AddDoctorConversionModal = ({
  open,
  onOpenChange,
  onAdd,
  fieldExecutives,
  doctors,
  products,
}: AddDoctorConversionModalProps) => {
  const [formData, setFormData] = useState({
    fieldExecutiveId: "",
    doctorId: "",
    productId: "",
  });

  const [errors, setErrors] = useState({
    fieldExecutiveId: false,
    doctorId: false,
    productId: false,
  });

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

    onAdd(formData);
    setFormData({
      fieldExecutiveId: "",
      doctorId: "",
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
                setFormData({ ...formData, fieldExecutiveId: value });
                setErrors({ ...errors, fieldExecutiveId: false });
              }}
            >
              <SelectTrigger
                className={errors.fieldExecutiveId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select Field Executive" />
              </SelectTrigger>
              <SelectContent>
                {fieldExecutives.map((fe) => (
                  <SelectItem key={fe.id} value={fe.id}>
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
              onValueChange={(value) => {
                setFormData({ ...formData, doctorId: value });
                setErrors({ ...errors, doctorId: false });
              }}
            >
              <SelectTrigger
                className={errors.doctorId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <SelectItem key={product.id} value={product.id}>
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
