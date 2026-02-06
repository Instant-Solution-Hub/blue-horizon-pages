import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Manager } from "./ManagerList";

interface UpdateManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager: Manager | null;
  onUpdate: (manager: Manager) => void;
}

const UpdateManagerModal = ({ open, onOpenChange, manager, onUpdate }: UpdateManagerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department: "",
    designation: "",
    managedTerritories: "",
  });

  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name,
        phone: manager.phone,
        department: manager.department,
        designation: manager.designation,
        managedTerritories: manager.managedTerritories.join(", "),
      });
    }
  }, [manager]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!manager) return;

    // Validation
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      toast({ title: "Error", description: "Phone must be a valid 10-digit number", variant: "destructive" });
      return;
    }
    if (!formData.department.trim()) {
      toast({ title: "Error", description: "Department is required", variant: "destructive" });
      return;
    }
    if (!formData.designation.trim()) {
      toast({ title: "Error", description: "Designation is required", variant: "destructive" });
      return;
    }
    if (!formData.managedTerritories.trim()) {
      toast({ title: "Error", description: "Managed Territories is required", variant: "destructive" });
      return;
    }

    const territoriesArray = formData.managedTerritories
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    onUpdate({
      ...manager,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
      managedTerritories: territoriesArray,
    });

    onOpenChange(false);
    toast({ title: "Success", description: "Manager updated successfully" });
  };

  if (!manager) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-name">Name *</Label>
            <Input
              id="update-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-email">Email</Label>
            <Input
              id="update-email"
              value={manager.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-employeeCode">Employee Code</Label>
            <Input
              id="update-employeeCode"
              value={manager.employeeCode}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-phone">Phone *</Label>
            <Input
              id="update-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-department">Department *</Label>
            <Input
              id="update-department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Enter department"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-designation">Designation *</Label>
            <Input
              id="update-designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="Enter designation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-managedTerritories">Managed Territories * (comma separated)</Label>
            <Input
              id="update-managedTerritories"
              value={formData.managedTerritories}
              onChange={(e) => setFormData({ ...formData, managedTerritories: e.target.value })}
              placeholder="e.g., North, South, East"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Manager</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateManagerModal;
